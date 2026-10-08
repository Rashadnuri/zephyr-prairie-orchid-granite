import { createFileRoute } from "@tanstack/react-router";
import { AtlasView } from "@/components/atlas-view";

export const Route = createFileRoute("/")({
  component: AtlasView,
});
