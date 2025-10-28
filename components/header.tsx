import { UserProfile } from "./user-profile";
import { AddRecipeButton } from "./add-recipe-button";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showAddButton?: boolean;
}

export function Header({ title, subtitle, showAddButton = false }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-600 truncate">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 ml-4">
          {showAddButton && (
            <div className="hidden sm:block">
              <AddRecipeButton />
            </div>
          )}
          <UserProfile />
        </div>
      </div>
    </header>
  );
}