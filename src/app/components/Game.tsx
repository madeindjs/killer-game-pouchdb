"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { usePouchDB } from "../../hooks/use-pouchdb";
import { Game } from "../../models/game";

export default function Game({ id }: { id: string }) {
  const db = usePouchDB(id);

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
    saveGame().catch(console.error);
  }

  function listenPouchDBChanges() {
    db.changes({ since: "now", doc_ids: ["game"], live: true, include_docs: true }).on("change", (change) => {
      setGame(change.doc as unknown as Game);
    });
  }

  useEffect(() => {
    listenPouchDBChanges();
    db.get<Game>("game")
      .then((existingGame) => setGame({ ...game, name: existingGame.name }))
      .catch();
  }, [id]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="">name</label>
          <input type="text" value={game?.name} onChange={handleNameChange} />
        </div>
        <input type="submit" />
      </form>
    </div>
  );
}
