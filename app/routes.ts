import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("platforms/:id", "routes/platforms.$id.tsx"),
] satisfies RouteConfig;
