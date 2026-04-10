"use client";

import dynamic from "next/dynamic";
import { RouteLoadingScreen } from "@/components/RouteLoadingScreen";

const HomeScreen = dynamic(
  () => import("@/components/HomeScreen").then((module) => module.HomeScreen),
  {
    ssr: false,
    loading: () => <RouteLoadingScreen message="Loading your study calendar…" />,
  },
);

export function HomeScreenClient() {
  return <HomeScreen />;
}
