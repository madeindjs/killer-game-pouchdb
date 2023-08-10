"use client";

import { useRouter } from "next/navigation";
import PouchDB from "pouchdb";
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";

export default function GameJoin() {
  const [gameId, setGameId] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyTaken, setAlreadyTaken] = useState(false);

  const router = useRouter();

  const handleGameIdChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    setGameId(event.target.value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    router.push(`/games/${gameId}`);
  };

  async function isPouchDbExists() {
    const db = new PouchDB(`http://127.0.0.1:5984/${gameId}`, { skip_setup: true });

    try {
      const info = await db.info();
      return !("error" in info);
    } catch {
      return false;
    }
  }

  useEffect(() => {
    setLoading(true);
    isPouchDbExists()
      .then(setAlreadyTaken)
      .finally(() => setLoading(false));
  }, [gameId]);

  return (
    <div>
      <form onSubmit={handleSubmit} aria-busy={loading}>
        <div>
          <label htmlFor="gameId">Game id</label>
          <input type="text" onChange={handleGameIdChange} readOnly={loading} />
        </div>

        <input type="submit" value={alreadyTaken ? "join this game" : "Create this game"} disabled={loading} />

        {!loading && <p>{alreadyTaken ? "This game already exists, you can join it" : "This game can be created"}</p>}
      </form>
    </div>
  );
}
