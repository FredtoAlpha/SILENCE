import { Navigate, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/fin")({
  beforeLoad: () => {
    throw redirect({
      to: "/livre/$book/fin",
      params: { book: "le-prix-du-sucre" },
    });
  },
  component: () => (
    <Navigate to="/livre/$book/fin" params={{ book: "le-prix-du-sucre" }} />
  ),
});
