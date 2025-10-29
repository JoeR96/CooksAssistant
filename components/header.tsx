import { UserProfile } from "./user-profile";
import { AddRecipeButton } from "./add-recipe-button";
import { ThemeDropdown } from "./theme-dropdown";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showAddButton?: boolean;
}

export function Header({ title, subtitle, showAddButton = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-sm">
              <span className="text-lg">🍳</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {showAddButton && <AddRecipeButton />}
            <ThemeDropdown />
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
}