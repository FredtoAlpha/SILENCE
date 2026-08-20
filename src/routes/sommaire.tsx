import { Navigate, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sommaire")({
  beforeLoad: () => {
    throw redirect({
      to: "/livre/$book/sommaire",
      params: { book: "le-prix-du-sucre" },
    });
  },
  component: () => (
    <Navigate to="/livre/$book/sommaire" params={{ book: "le-prix-du-sucre" }} />
  ),
});
