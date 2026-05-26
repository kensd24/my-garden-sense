import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Home, Leaf, Layers, Settings as SettingsIcon } from "lucide-react";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const navItems = [
  { to: "/", label: "Dashboard", icon: Home, exact: true },
  { to: "/plants", label: "Plants", icon: Leaf, exact: false },
  { to: "/groups", label: "Groups", icon: Layers, exact: false },
  { to: "/settings", label: "Settings", icon: SettingsIcon, exact: false },
] as const;

function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-md px-5 py-4 flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary grid place-items-center">
            <Leaf className="size-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">GardenMind</h1>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-md px-5 py-6 pb-28">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 border-t border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-md grid grid-cols-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="flex flex-col items-center gap-1 py-3 text-xs text-muted-foreground data-[status=active]:text-primary transition-colors"
            >
              <item.icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
