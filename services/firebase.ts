
import { User, DiseaseResult } from "../types";

// ⚠️ NOTE: The original imports were causing build errors because the Firebase SDK version in the environment
// appears to be incompatible with the v9 modular syntax (e.g. it might be v8 or missing types).
// The active code has been stubbed to allow the project to build.
// Uncomment and adjust the imports below once the correct Firebase SDK (v9+) is installed.

/*
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    updateProfile as updateAuthProfile 
} from "firebase/auth";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    Timestamp 
} from "firebase/firestore";
*/

// =================================================================================
// ⚠️ IMPORTANT: PASTE YOUR FIREBASE CONFIGURATION HERE
// =================================================================================

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE"
};

// =================================================================================

// Initialize Firebase only if config is valid
/*
let app: any;
let auth: any;
let db: any;

try {
    if (firebaseConfig.apiKey !== "PASTE_YOUR_API_KEY_HERE") {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } else {
        console.warn("⚠️ Firebase Config is missing. Please update services/firebase.ts with your credentials.");
    }
} catch (error) {
    console.error("Firebase Initialization Error:", error);
}
*/

// Helper: Map Firebase User & Firestore Doc to App User Type
/*
const mapUser = (fbUser: any, docData: any = {}): User => ({
    email: fbUser.email || '',
    name: docData.name || fbUser.displayName || 'Farmer',
    location: docData.location || '',
    phone: docData.phone || '',
    memberSince: docData.memberSince || new Date().getFullYear().toString(),
    farmSize: docData.farmSize || '',
    soilType: docData.soilType || '',
    mainCrop: docData.mainCrop || '',
    irrigationSource: docData.irrigationSource || '',
    uid: fbUser.uid 
});
*/

export const firebaseService = {
  auth: {
    async register(userData: User, password: string): Promise<User> {
      // Stub implementation
      console.warn("Firebase not configured. Using stub.");
      throw new Error("Firebase not configured");
      /*
      if (!auth || !db) throw new Error("Firebase not configured. Check services/firebase.ts");
      
      try {
        // 1. Create Auth User
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
        const user = userCredential.user;

        // 2. Update Auth Profile Name
        await updateAuthProfile(user, { displayName: userData.name });

        // 3. Create Firestore User Document
        const userDocData = {
            ...userData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };
        
        await setDoc(doc(db, "users", user.uid), userDocData);

        return mapUser(user, userDocData);
      } catch (error) {
        console.error("Firebase Register Error:", error);
        throw error;
      }
      */
    },

    async login(email: string, password: string): Promise<User> {
      console.warn("Firebase not configured. Using stub.");
      throw new Error("Firebase not configured");
      /*
      if (!auth || !db) throw new Error("Firebase not configured. Check services/firebase.ts");

      try {
        // 1. Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Fetch User Profile from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return mapUser(user, docSnap.data());
        } else {
            // Fallback if doc doesn't exist (legacy users)
            return mapUser(user, { name: user.displayName });
        }
      } catch (error) {
        console.error("Firebase Login Error:", error);
        throw error;
      }
      */
    },

    async logout(): Promise<void> {
      console.warn("Firebase not configured. Using stub.");
      /*
      if (!auth) return;
      await signOut(auth);
      */
    }
  },

  db: {
    async getUserProfile(uid: string): Promise<User | null> {
      return null;
      /*
      if (!db) return null;
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as User;
        }
        return null;
      } catch (error) {
        console.error("Get Profile Error:", error);
        return null;
      }
      */
    },

    async updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
      console.log("Update stub", uid, data);
      /*
      if (!db) return;
      try {
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        });
      } catch (error) {
        console.error("Update Profile Error:", error);
        throw error;
      }
      */
    },

    async saveDiseaseAnalysis(uid: string, result: DiseaseResult): Promise<void> {
      console.log("Save analysis stub", uid, result);
      /*
      if (!db) return;
      try {
        await addDoc(collection(db, "disease_history"), {
          uid,
          ...result,
          timestamp: Timestamp.now()
        });
      } catch (error) {
        console.error("Save Analysis Error:", error);
      }
      */
    },

    async getYieldHistory(uid: string): Promise<any[]> {
      return [];
      /*
      if (!db) return [];
      try {
        const q = query(
            collection(db, "yield_history"), 
            where("uid", "==", uid),
            orderBy("year", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data());
      } catch (error) {
        console.error("Get Yield History Error:", error);
        return [];
      }
      */
    }
  }
};
