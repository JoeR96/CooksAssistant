import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { mealPlanQueries } from '@/lib/db/queries';
import { Box, Container, Typography, Card, CardContent, Stack, Chip } from '@mui/material';

export default async function MealPlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { id } = await params;
  const plan = await mealPlanQueries.getById(id, userId);
  if (!plan) notFound();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>{plan.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {plan.startDate} – {plan.endDate}
        </Typography>
      </Box>

      {plan.meals.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              No meals planned yet. Add one via <code>POST /api/meal-plans/{plan.id}/meals</code> with
              recipeId, scheduledDate, mealType, servings.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {plan.meals.map(meal => (
            <Card key={meal.id}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>{meal.recipe.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meal.scheduledDate} · {meal.mealType} · {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <Chip label={meal.status} size="small" />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}
