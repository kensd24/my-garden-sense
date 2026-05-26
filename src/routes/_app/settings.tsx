import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — GardenMind" },
      { name: "description", content: "Manage your account and garden location." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Settings</h2>

      <section className="rounded-2xl bg-card border border-border p-5 space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="size-4 text-leaf" /> Location
        </div>
        <p className="text-sm text-muted-foreground">
          Sanderstead, London, UK
        </p>
      </section>

      <section className="rounded-2xl bg-card border border-border p-5">
        <p className="text-sm font-medium">Account</p>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in coming soon.
        </p>
      </section>
    </div>
  );
}
