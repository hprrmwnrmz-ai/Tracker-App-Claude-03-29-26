import { openDB } from 'idb'

const DB_NAME = 'slate-photos'
const STORE_NAME = 'photos'

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME)
    },
  })
}

export async function savePhotoBlob(key: string, blob: Blob): Promise<void> {
  const db = await getDb()
  await db.put(STORE_NAME, blob, key)
}

export async function getPhotoBlob(key: string): Promise<Blob | undefined> {
  const db = await getDb()
  return db.get(STORE_NAME, key)
}

export async function deletePhotoBlob(key: string): Promise<void> {
  const db = await getDb()
  await db.delete(STORE_NAME, key)
}

export async function getPhotoBlobUrl(key: string): Promise<string | undefined> {
  const blob = await getPhotoBlob(key)
  if (!blob) return undefined
  return URL.createObjectURL(blob)
}
