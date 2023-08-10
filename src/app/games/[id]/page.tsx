import GameInfoForm from "../../components/GameInfoForm";

export default function GameIdPage({ params: { id } }: { params: { id: string } }) {
  return (
    <div>
      <h1>game: {id}</h1>
      <GameInfoForm id={id} />
    </div>
  );
}
