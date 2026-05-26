import { createFileRoute } from "@tanstack/react-router";
import { Layers, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/groups")({
  head: () => ({
    meta: [
      { title: "Groups — GardenMind" },
      { name: "description", content: "Organise plants by area of the garden." },
    ],
  }),
  component: GroupsPage,
});

function GroupsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Groups</h2>
        <button className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
          <Plus className="size-4" /> New
        </button>
      </header>

      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <Layers className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 font-medium">No groups yet</p>
        <p className="text-sm text-muted-foreground">
          Create groups like "Vegetable patch" to organise your plants.
        </p>
      </div>
    </div>
  );
}
