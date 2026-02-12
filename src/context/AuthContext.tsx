import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface UserData {
    uid: string;
    email: string | null;
    displayName: string | null;
    role: 'user' | 'admin';
    photoURL?: string | null;
}

interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    logout: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    isAdmin: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch additional user data (role) from Firestore
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: data.displayName || firebaseUser.displayName,
                        role: data.role || 'user',
                        photoURL: firebaseUser.photoURL,
                    });
                } else {
                    // If user exists in Auth but not in Firestore (shouldn't happen ideally if registered correctly)
                    // default to 'user' role
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        role: 'user',
                        photoURL: firebaseUser.photoURL,
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            logout,
            isAdmin: user?.role === 'admin'
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
