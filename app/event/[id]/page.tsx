import { EventDetailScreenClient } from "@/components/EventDetailScreenClient";

type EventPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  return <EventDetailScreenClient eventId={id} />;
}
