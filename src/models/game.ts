export interface GameInfo {
  name: string;
}

export type GameInfoDB = PouchDB.Core.Document<GameInfo> & PouchDB.Core.GetMeta;
