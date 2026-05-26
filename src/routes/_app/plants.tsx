import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/plants")({
  head: () => ({
    meta: [
      { title: "Plants — GardenMind" },
      { name: "description", content: "Manage your plants and watering schedules." },
    ],
  }),
  component: PlantsPage,
});

function PlantsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Plants</h2>
        <button className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
          <Plus className="size-4" /> Add
        </button>
      </header>

      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <Leaf className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 font-medium">No plants yet</p>
        <p className="text-sm text-muted-foreground">
          Add your first plant to start tracking watering.
        </p>
      </div>
    </div>
  );
}
