import { getPouchDB } from "./use-pouchdb";

export function useGame(id: string, db: ReturnType<typeof getPouchDB>) {
  db.get("game");
}
