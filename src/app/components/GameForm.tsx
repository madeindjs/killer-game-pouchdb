"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { getPouchDB } from "../../hooks/use-pouchdb";
import { Game } from "../../models/game";
import { GameService } from "../../service/game";

export default function Game({ id }: { id: string }) {
  const db = getPouchDB(id);
  const gameService = new GameService(id);

  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<Game>({ name: "untitled" });

  async function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setGame({ ...game, name: event.target.value });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    gameService
      .save(game)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  function listenPouchDBChanges() {
    db.changes({ since: "now", doc_ids: ["game"], live: true, include_docs: true }).on("change", (change) => {
      setGame(change.doc as unknown as Game);
    });
  }

  useEffect(() => {
    listenPouchDBChanges();
    setLoading(true);
    gameService
      .get()
      .then((existingGame) => existingGame && setGame({ ...game, name: existingGame.name }))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <form onSubmit={handleSubmit} aria-busy={loading}>
        <div>
          <label htmlFor="gameName">name</label>
          <input type="text" id="gameName" value={game?.name} onChange={handleNameChange} readOnly={loading} />
        </div>
        <input type="submit" disabled={loading} />
      </form>
    </div>
  );
}
