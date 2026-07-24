import { getDatabase, type PortableDatabase } from "./database";
import { getDocumentStorage, type DocumentStorage } from "./storage";

export type ServerEnv = NodeJS.ProcessEnv & {
  DB?: PortableDatabase;
  DOCUMENTS?: DocumentStorage;
};

export const env: ServerEnv = new Proxy(process.env as ServerEnv, {
  get(target, property, receiver) {
    if (property === "DB") return getDatabase();
    if (property === "DOCUMENTS") return getDocumentStorage();
    return Reflect.get(target, property, receiver);
  },
});
