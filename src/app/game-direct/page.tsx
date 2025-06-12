import GameInterface from "@/components/game/GameInterface";

export default function GameDirectPage() {
  return (
    <div>
      <div className="fixed top-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded z-50">
        ⚠️ Direct Game Access (No Auth)
      </div>
      <GameInterface />
    </div>
  );
}