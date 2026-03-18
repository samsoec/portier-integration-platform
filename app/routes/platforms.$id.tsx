import type { Route } from "./+types/platforms.$id";
import { PlatformDetail } from "~/features/platform-detail";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Platform ${params.id} - Integration Platform` }];
}

export default function PlatformDetailPage({ params }: Route.ComponentProps) {
  return <PlatformDetail id={params.id} />;
}
