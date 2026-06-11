import { Stack } from "expo-router";
import BottomNav from "../components/BottomNav";

export default function Layout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomNav />
    </>
  );
}