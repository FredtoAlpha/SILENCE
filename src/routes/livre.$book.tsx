import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/livre/$book")({
  component: () => <Outlet />,
});
