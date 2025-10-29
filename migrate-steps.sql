-- Convert steps column from text to json array
ALTER TABLE "recipes" ADD COLUMN "steps_temp" json;

-- Convert existing text steps to JSON array
UPDATE "recipes" SET "steps_temp" = 
  CASE 
    WHEN "steps" IS NOT NULL AND "steps" != '' THEN 
      to_json(
        array(
          SELECT trim(regexp_replace(step, '^[0-9]+\.\s*', ''))
          FROM unnest(string_to_array("steps", E'\n')) AS step
          WHERE trim(step) != ''
        )
      )
    ELSE '[]'::json
  END;

-- Drop the old column
ALTER TABLE "recipes" DROP COLUMN "steps";

-- Rename the temp column
ALTER TABLE "recipes" RENAME COLUMN "steps_temp" TO "steps";

-- Make it NOT NULL
ALTER TABLE "recipes" ALTER COLUMN "steps" SET NOT NULL;