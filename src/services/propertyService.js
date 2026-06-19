import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

const COLLECTION_NAME = 'properties';

export const generateJoinCode = (name) => {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  let initials = '';
  
  if (words.length === 1) {
    initials = words[0].substring(0, 3).toUpperCase();
  } else if (words.length === 2) {
    initials = words[0][0].toUpperCase() + words[1][0].toUpperCase();
  } else {
    initials = words.map(w => w[0].toUpperCase()).join('').substring(0, 3);
  }

  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${initials}-${randomString}`;
};

export const createProperty = async (ownerUid, propertyData) => {
  const joinCode = generateJoinCode(propertyData.name);
  
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...propertyData,
    ownerUid,
    joinCode,
    status: 'active',
    totalTenants: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return { id: docRef.id, joinCode, ...propertyData, status: 'active', totalTenants: 0, ownerUid };
};

export const getProperties = async (ownerUid) => {
  const q = query(
    collection(db, COLLECTION_NAME), 
    where("ownerUid", "==", ownerUid),
    where("status", "!=", "archived")
  );
  
  const querySnapshot = await getDocs(q);
  const properties = [];
  querySnapshot.forEach((doc) => {
    properties.push({ id: doc.id, ...doc.data() });
  });
  
  return properties;
};

export const updateProperty = async (propertyId, updates) => {
  const propertyRef = doc(db, COLLECTION_NAME, propertyId);
  await updateDoc(propertyRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const archiveProperty = async (propertyId) => {
  const propertyRef = doc(db, COLLECTION_NAME, propertyId);
  await updateDoc(propertyRef, {
    status: 'archived',
    updatedAt: serverTimestamp()
  });
};
