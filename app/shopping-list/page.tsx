import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ShoppingListDashboard } from '@/components/shopping-list-dashboard';

export default async function ShoppingListPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ShoppingListDashboard userId={userId} />
    </div>
  );
}