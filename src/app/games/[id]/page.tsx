import GameForm from "../../components/GameForm";

export default function GameIdPage({ params: { id } }: { params: { id: string } }) {
  return (
    <div>
      <h1>game: {id}</h1>
      <GameForm id={id} />
    </div>
  );
}
