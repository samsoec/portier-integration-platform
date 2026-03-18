import type { Route } from "./+types/home";
import { IntegrationList } from "~/features/integration-list";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home - Integration Platform" },
    { name: "description", content: "Welcome to the Integration Platform!" },
  ];
}

export default function Home() {
  return <IntegrationList />;
}
