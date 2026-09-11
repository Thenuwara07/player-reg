const DB_NAME = 'UserFilesDB';
const STORE_NAME = 'userFiles';

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'filename' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('DB error');
  });
};

export const saveFile = async (file: File): Promise<string> => {
  const db = await initDB();
  const filename = `file_${Date.now()}${file.name.substring(file.name.lastIndexOf('.'))}`;
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const reader = new FileReader();
    reader.onload = () => {
      store.put({ filename, data: reader.result });
      resolve(filename);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getAllFiles = async (): Promise<{ filename: string; data: string }[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Failed to fetch files');
  });
};