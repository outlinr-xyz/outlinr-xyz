import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-semibold">Welcome to Outlinr</h1>
      <Button asChild>
        <Link to="/home">Go to Home</Link>
      </Button>
    </div>
  );
}
