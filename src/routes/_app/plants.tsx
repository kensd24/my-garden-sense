import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Droplets, Leaf, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/plants")({
  head: () => ({
    meta: [
      { title: "Plants — GardenMind" },
      { name: "description", content: "Manage your plants and watering schedules." },
    ],
  }),
  component: PlantsPage,
});

type Plant = {
  id: string;
  name: string;
  species: string | null;
  notes: string | null;
  watering_frequency_days: number;
  last_watered_at: string | null;
  created_at: string;
};

function daysUntilNextWatering(p: Plant): number {
  if (!p.last_watered_at) return 0;
  const last = new Date(p.last_watered_at).getTime();
  const next = last + p.watering_frequency_days * 86400000;
  return Math.ceil((next - Date.now()) / 86400000);
}

function PlantsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: plants = [], isLoading } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plants")
        .select("id, name, species, notes, watering_frequency_days, last_watered_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Plant[];
    },
  });

  const addPlant = useMutation({
    mutationFn: async (input: { name: string; watering_frequency_days: number; notes?: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Please sign in to add plants.");
      const { error } = await supabase.from("plants").insert({
        name: input.name,
        watering_frequency_days: input.watering_frequency_days,
        notes: input.notes || null,
        user_id: userData.user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plants"] });
      toast.success("Plant added");
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const markWatered = useMutation({
    mutationFn: async (id: string) => {
      const today = new Date().toISOString().slice(0, 10);
      const { error } = await supabase
        .from("plants")
        .update({ last_watered_at: today })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plants"] });
      toast.success("Marked as watered");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addPlant.mutate({
      name: String(fd.get("name") || "").trim(),
      watering_frequency_days: Number(fd.get("freq") || 7),
      notes: String(fd.get("notes") || "").trim() || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Plants</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full gap-1.5">
              <Plus className="size-4" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a plant</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required placeholder="Tomato" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="freq">Watering frequency (days)</Label>
                <Input id="freq" name="freq" type="number" min={1} defaultValue={7} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea id="notes" name="notes" placeholder="In the south border…" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={addPlant.isPending}>
                  {addPlant.isPending ? "Adding…" : "Add plant"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : plants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <Leaf className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 font-medium">No plants yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first plant to start tracking watering.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {plants.map((p) => {
            const days = daysUntilNextWatering(p);
            const overdue = p.last_watered_at && days <= 0;
            return (
              <li
                key={p.id}
                className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {!p.last_watered_at
                      ? "Never watered"
                      : overdue
                        ? `Overdue by ${Math.abs(days)}d`
                        : `Water in ${days}d`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={overdue || !p.last_watered_at ? "default" : "outline"}
                  onClick={() => markWatered.mutate(p.id)}
                  disabled={markWatered.isPending}
                  className="gap-1.5 shrink-0"
                >
                  <Droplets className="size-4" />
                  Water
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
