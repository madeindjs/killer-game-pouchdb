import { usePouchDB } from "./use-pouchdb";

export function useGame(id: string, db: ReturnType<typeof usePouchDB>) {
  db.get("game");
}
