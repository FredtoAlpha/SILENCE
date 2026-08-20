import { Navigate, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/carte")({
  beforeLoad: () => {
    throw redirect({
      to: "/livre/$book/carte",
      params: { book: "le-prix-du-sucre" },
    });
  },
  component: () => (
    <Navigate to="/livre/$book/carte" params={{ book: "le-prix-du-sucre" }} />
  ),
});
