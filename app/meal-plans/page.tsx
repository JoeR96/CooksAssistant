import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { mealPlanQueries } from '@/lib/db/queries';
import { Container, Typography, Card, CardContent, Stack } from '@mui/material';

export default async function MealPlansPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const plans = await mealPlanQueries.listByUser(userId);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>Meal Plans</Typography>
      </Stack>

      {plans.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              No meal plans yet. Create one via <code>POST /api/meal-plans</code> with name, startDate, endDate.
              Rich UI to follow.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {plans.map(plan => (
            <Link
              key={plan.id}
              href={`/meal-plans/${plan.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Card sx={{ '&:hover': { boxShadow: 4 } }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>{plan.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {plan.startDate} – {plan.endDate}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Stack>
      )}
    </Container>
  );
}
