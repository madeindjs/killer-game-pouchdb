import PouchDB from "pouchdb";

export function usePouchDB(name: string) {
  const db = new PouchDB(`http://127.0.0.1:5984/${name}`);
  // const db = new PouchDB(`${process.env.POUCHDB_SERVER}/${name}`);
  // console.log(db.);

  // db.changes().on("change", function () {
  //   console.log("Ch-Ch-Changes");
  // });

  // db.replicate.to(`${process.env.POUCHDB_SERVER}`);

  return db;
}
