export default function GameIdPage({ params: { id } }: { params: { id: string } }) {
  return (
    <div>
      <h1>game: {id}</h1>
    </div>
  );
}
