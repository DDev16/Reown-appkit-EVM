'use client';

// lib/authHandler.ts
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';



export const checkIsAdmin = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() && userDoc.data().isAdmin === true;
  } catch (error) {
    return false;
  }
};