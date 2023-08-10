export interface Game {
  name: string;
}

export type GameDB = PouchDB.Core.Document<Game> & PouchDB.Core.GetMeta;
