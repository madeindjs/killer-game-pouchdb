"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { usePouchDB } from "../../hooks/use-pouchdb";
import { Game } from "../../models/game";

export default function Game({ id }: { id: string }) {
  const db = usePouchDB(id);

  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<Game>({ name: "untitled" });

  async function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setGame({ ...game, name: event.target.value });
  }

  async function saveGame() {
    const existingGame = await db.get<Game>("game").catch(() => undefined);
    const isDirty = game.name !== existingGame?.name;

    if (isDirty) db.put({ _id: "game", ...existingGame, name: game.name }, {});
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    saveGame()
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
    db.get<Game>("game")
      .then((existingGame) => setGame({ ...game, name: existingGame.name }))
      .catch()
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
