let dbPromise = idb.open('StoreMon', 1, (db) => {
    if (!db.objectStoreNames.contains('inventar')) {
      db.createObjectStore('inventar', {keyPath: 'invBr'})
    }
  });