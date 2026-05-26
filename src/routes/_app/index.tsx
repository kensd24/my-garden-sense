import { createFileRoute } from "@tanstack/react-router";
import { CloudSun, Droplets } from "lucide-react";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — GardenMind" },
      { name: "description", content: "Today's weather and watering status for your garden." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-muted-foreground">Good morning</p>
        <h2 className="text-2xl font-semibold">Your garden today</h2>
      </section>

      <section className="rounded-2xl bg-card border border-border p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <CloudSun className="size-8 text-sky" />
          <div>
            <p className="text-sm text-muted-foreground">Sanderstead, London</p>
            <p className="text-lg font-medium">Weather will load here</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-secondary p-5">
        <div className="flex items-center gap-2 text-secondary-foreground">
          <Droplets className="size-5" />
          <h3 className="font-semibold">Needs watering today</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Add your first plant to start getting recommendations.
        </p>
      </section>

      <section>
        <h3 className="font-semibold mb-3">7-day forecast</h3>
        <div className="rounded-2xl bg-card border border-border p-4 text-sm text-muted-foreground">
          Forecast strip placeholder
        </div>
      </section>
    </div>
  );
}
