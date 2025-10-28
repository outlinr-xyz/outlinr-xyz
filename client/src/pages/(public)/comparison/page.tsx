import { Link } from 'react-router';

import { Button } from '@/components/ui/button';

export default function ComparisonPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Comparison</h1>
      <Button asChild>
        <Link to="/">Go to Home</Link>
      </Button>
    </div>
  );
}
