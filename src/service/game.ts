import PouchDB from "pouchdb";
import { GameInfo, GameInfoDB } from "../models/game";

export class GameService {
  private db: PouchDB.Database;

  constructor(public readonly id: string) {
    this.db = new PouchDB(this.url, { skip_setup: true });
  }

  private get url() {
    return `http://127.0.0.1:5984/${this.id}`;
  }

  async exists(): Promise<boolean> {
    const db = new PouchDB(this.url, { skip_setup: true });

    try {
      const info = await db.info();
      return !("error" in info);
    } catch {
      return false;
    }
  }

  async getInfo(): Promise<GameInfoDB | undefined> {
    return this.db.get<GameInfo>("game").catch(() => undefined);
  }

  async saveInfo(game: GameInfo): Promise<GameInfoDB> {
    const existingGame = await this.getInfo();

    if (existingGame === undefined) {
      const res = await this.db.post<GameInfo>(game);
      return { _id: "game", ...game, _rev: res.rev };
    }

    const isDirty = game.name !== existingGame?.name;

    if (!isDirty) return existingGame;

    const res = await this.db.put<GameInfo>({ ...existingGame, name: game.name });
    return { _id: "game", ...game, _rev: res.rev };
  }
}
