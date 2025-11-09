import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createCheckoutUrl, getPlans } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import type { Plan } from '@/types';

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuthStore();

  useEffect(() => {
    getPlans().then(setPlans);
  }, []);

  const handleSubscribe = async (variantId: string) => {
    if (!session) {
      setError('You must be logged in to subscribe.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const checkoutUrl = await createCheckoutUrl(
        variantId,
        session.user.email!,
      );
      window.location.href = checkoutUrl;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">Pricing</h1>
      {error && <p className="mb-4 text-center text-red-500">{error}</p>}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${plan.price / 100}</p>
              <Button
                className="mt-4 w-full"
                onClick={() => handleSubscribe(plan.lemon_variant_id)}
                disabled={loading}
              >
                {loading ? 'Redirecting...' : 'Subscribe'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
