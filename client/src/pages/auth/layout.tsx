import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center text-2xl font-medium">
          <div className="flex size-8 items-center justify-center rounded-md">
            <img src="/favicon.svg" className="size-12 rounded-lg" />
          </div>
          Outlinr
        </div>
        <Outlet />
      </div>
    </div>
  );
}
