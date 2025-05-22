import { Metadata } from "next";
import GameInterface from "@/components/game/GameInterface";

export const metadata: Metadata = {
  title: "Play Paperclip Clicker",
  description: "Click to make paperclips in this addictive idle game",
};

export default function GamePage() {
  return <GameInterface />;
}
