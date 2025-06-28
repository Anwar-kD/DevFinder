import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {db} from "../config/firebase-config";
import {useAuth} from "../context/AuthContext";

interface OffreData {
  id: string; // recommandé pour faciliter le suivi côté front
  title: string;
  description: string;
  company: string; // remplace number (le nom est souvent une string comme "Google")
  type: 'présentiel' | 'télétravail' | 'hybride'; // plus explicite avec un type union
  location: string | null; // null ou ville
  date: string; // mieux de le stocker en ISO string si ça vient d'une API (ex: "2024-06-25T12:34:00Z")
}

interface ApplicationData {
  id: string; // pour identifier l’application
  offreId: string; // lien avec l’offre appliquée
  lettre: string;
  cv: string; // pourrait être un URL vers Firebase Storage
  location: string | null; // la localisation choisie par le candidat
  dateApplication: string; // ISO format
  status: 'envoyée' | 'en attente' | 'acceptée' | 'rejetée'; // bonne pratique
}

export const useAddApplication = () => {
    const applicationCollectionRef  = collection(db, "applications");
    const {currentUser} = useAuth();
    const userID = currentUser?.uid;
    const addApplication = async ({offreId,lettre,cv,location,dateApplication,status}:ApplicationData): Promise<void> =>{
        await addDoc(applicationCollectionRef , {
            userID,
            offreId,
            lettre,
            cv,
            location,
            dateApplication,
            status
        });
    }
    return {addApplication};
}