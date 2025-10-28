import { Link } from 'react-router';

import { Button } from '@/components/ui/button';

export default function PublicPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Welcome to Outlinr</h1>
      <Button asChild>
        <Link to="/app/home">Go to Home</Link>
      </Button>
    </div>
  );
}
