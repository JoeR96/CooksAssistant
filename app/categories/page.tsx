import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { CategoryDashboard } from '@/components/category-dashboard';

export default async function CategoriesPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryDashboard userId={userId} />
    </div>
  );
}