import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcAwTvzEmvrnebOOG7YNFb9tEAcjPIi9U",
  authDomain: "darg-drop.firebaseapp.com",
  projectId: "darg-drop",
  storageBucket: "darg-drop.firebasestorage.app",
  messagingSenderId: "948084488361",
  appId: "1:948084488361:web:093365ae2a637d2aca91b8",
  measurementId: "G-JW6HNS6SVH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Add userId to Firestore queries

// Example function to fetch projects for the logged-in user
export const fetchUserProjects = async (userId: string) => {
  const projectsRef = collection(db, "projects");
  const q = query(projectsRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};
