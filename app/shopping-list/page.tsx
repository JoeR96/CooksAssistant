import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { shoppingListQueries, mealPlanQueries } from '@/lib/db/queries';
import { Container, Typography, Card, CardContent, Stack, Box, Checkbox, Chip } from '@mui/material';

export default async function ShoppingListPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const [list, plans] = await Promise.all([
    shoppingListQueries.getCurrent(userId),
    mealPlanQueries.listByUser(userId),
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>Shopping List</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Generate from a meal plan via <code>POST /api/shopping-list/generate</code> with a mealPlanId,
          or add items manually via <code>POST /api/shopping-list/items</code>.
        </Typography>
      </Box>

      {plans.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Available meal plans</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {plans.map(p => (
                <Chip key={p.id} label={`${p.name} (${p.id.slice(0, 8)})`} size="small" />
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {!list || list.items.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              No items yet. Generate from a meal plan above or add items manually.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>{list.name}</Typography>
            <Stack spacing={1}>
              {list.items.map(item => (
                <Stack key={item.id} direction="row" alignItems="center" spacing={1}>
                  <Checkbox checked={item.checked} disabled />
                  <Typography sx={{ textDecoration: item.checked ? 'line-through' : 'none' }}>
                    {item.name}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
