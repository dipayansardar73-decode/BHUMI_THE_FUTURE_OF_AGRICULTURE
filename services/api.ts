import { User } from '../types';
import { auth, db } from './firebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile as updateAuthProfile
} from 'firebase/auth';
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc 
} from 'firebase/firestore';

// API Service wrapping Firebase functionality
export const api = {
    auth: {
        async login(email: string, password: string): Promise<User> {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                // Fetch extra user details from Firestore
                const docRef = doc(db, "users", userCredential.user.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    return { ...docSnap.data(), email: userCredential.user.email } as User;
                }
                
                // Fallback if firestore doc doesn't exist
                return { 
                    email: userCredential.user.email || '', 
                    name: userCredential.user.displayName || 'Farmer' 
                } as User;
            } catch (error) {
                console.error("Login Error:", error);
                throw error;
            }
        },

        async signup(user: User, password: string): Promise<User> {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, user.email, password);
                
                // Update Auth Profile Display Name
                await updateAuthProfile(userCredential.user, {
                    displayName: user.name
                });

                // Store extended user data in Firestore
                const userData: User = {
                    ...user,
                    memberSince: new Date().getFullYear().toString()
                };

                await setDoc(doc(db, "users", userCredential.user.uid), userData);
                return userData;
            } catch (error) {
                console.error("Signup Error:", error);
                throw error;
            }
        },

        async logout(): Promise<void> {
            await signOut(auth);
            localStorage.removeItem('bhumi_user'); // Clean up any local fallbacks
        },

        getCurrentUser(): Promise<User | null> {
            return new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                    unsubscribe();
                    if (firebaseUser) {
                        try {
                            const docRef = doc(db, "users", firebaseUser.uid);
                            const docSnap = await getDoc(docRef);
                            if (docSnap.exists()) {
                                resolve(docSnap.data() as User);
                            } else {
                                resolve({ 
                                    email: firebaseUser.email || '', 
                                    name: firebaseUser.displayName || '' 
                                } as User);
                            }
                        } catch (e) {
                            console.error("Error fetching user profile:", e);
                            resolve({ 
                                email: firebaseUser.email || '', 
                                name: firebaseUser.displayName || '' 
                            } as User);
                        }
                    } else {
                        resolve(null);
                    }
                });
            });
        }
    },

    user: {
        async updateProfile(user: User): Promise<User> {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("No authenticated user");

            try {
                // Update Firestore
                const userRef = doc(db, "users", currentUser.uid);
                await updateDoc(userRef, { ...user });
                
                // Update Auth Profile if name changed
                if (user.name !== currentUser.displayName) {
                    await updateAuthProfile(currentUser, { displayName: user.name });
                }
                
                return user;
            } catch (error) {
                console.error("Update Profile Error:", error);
                throw error;
            }
        }
    },

    // Example of extending for other features
    crops: {
        async getHistory(): Promise<any[]> {
            // Placeholder for future Firestore crop history collection
            return [];
        }
    }
};