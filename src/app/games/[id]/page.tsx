import Game from "../../components/Game";

export default function GameIdPage({ params: { id } }: { params: { id: string } }) {
  return (
    <div>
      <h1>game: {id}</h1>
      <Game id={id} />
    </div>
  );
}
