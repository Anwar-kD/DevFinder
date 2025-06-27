import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type {ReactNode} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import type {User} from "firebase/auth";
import { auth } from "../config/firebase-config"; // Assure-toi que ton fichier firebase.ts est bien configuré

// Types du contexte
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;

}

// Valeur initiale par défaut
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Props du provider
interface AuthProviderProps {
  children: ReactNode;
}

// Composant provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Synchronisation avec Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fonctions Auth
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }  
  };
  const updateUserProfile = async (displayName: string) => {
    if (currentUser) {
      await updateProfile(currentUser, {
        displayName: displayName
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  // Valeurs exposées dans le contexte
  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    signInWithGoogle,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
