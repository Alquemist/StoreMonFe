import Dexie from 'dexie';


const db = new Dexie('StoreMon');

db.version(4).stores({
  userData: 'userID'
});


export const getUserData = async () => {
  const userData = await db.userData.toArray()
  console.log(userData[0])
  return userData[0]
};

export const storeUserData = async (userData) => {
  await db.userData.add(userData)
  return
};

export const removeUserData = (userID) => {
  db.userData.delete(userID)
};

//await db.userData.add({userID: 1, ime: 'np', prezime: 'pm'})