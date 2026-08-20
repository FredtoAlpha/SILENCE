import { Navigate, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/lire/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/livre/$book/lire/$slug",
      params: { book: "le-prix-du-sucre", slug: params.slug },
    });
  },
  component: function RedirectEpisode() {
    const { slug } = Route.useParams();
    return (
      <Navigate
        to="/livre/$book/lire/$slug"
        params={{ book: "le-prix-du-sucre", slug }}
      />
    );
  },
});
