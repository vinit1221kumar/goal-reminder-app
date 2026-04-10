"use client";

import dynamic from "next/dynamic";
import { RouteLoadingScreen } from "@/components/RouteLoadingScreen";

type EventDetailScreenClientProps = {
  eventId: string;
};

const EventDetailScreen = dynamic(
  () => import("@/components/EventDetailScreen").then((module) => module.EventDetailScreen),
  {
    ssr: false,
    loading: () => <RouteLoadingScreen message="Loading event…" />,
  },
);

export function EventDetailScreenClient({ eventId }: EventDetailScreenClientProps) {
  return <EventDetailScreen eventId={eventId} />;
}
