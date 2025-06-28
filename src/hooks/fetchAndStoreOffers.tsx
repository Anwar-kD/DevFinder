import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase-config";

interface IndeedRawJob {
  key: string;
  title: string;
  url: string;
  jobUrl: string;
  datePublished: string;
  description: { text: string };
  employer: { name: string; logoUrl?: string };
  location: { city?: string } | null;
  benefits?: Record<string, string>;
}

export const importJobsFromApi = async () => {
  try {
    console.log("Début de l'import des offres...");
    
    // 1. Supprimer tous les documents existants
    const snapshot = await getDocs(collection(db, "offers"));
    
    // Attendre que tous les documents soient supprimés
    await Promise.all(
      snapshot.docs.map(docSnap =>
        deleteDoc(doc(db, "offers", docSnap.id))
      )
    );
    

    // 2. Récupérer les nouvelles données
    const res = await fetch("https://api.apify.com/v2/datasets/NnPb1wbUhp7ksQlVa/items?token=apify_api_rezembg802lWwD4KOD32vC4aIu7w0L17FBBq");
    
    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status}`);
    }
    
    const data: IndeedRawJob[] = await res.json();

    // 3. Limiter à 5 offres exactement
    const limitedData = data.slice(0, 5);
    console.log(`Traitement de ${limitedData.length} offres...`);

    // 4. Ajouter les nouvelles offres une par une
    const addedOffers = [];
    for (const [index, item] of limitedData.entries()) {
      const type = item.location?.city ? "présentiel" : "télétravail";

      const offer = {
        title: item.title || `Offre ${index + 1}`,
        description: item.description?.text || "",
        company: item.employer?.name || "Entreprise inconnue",
        type,
        location: item.location?.city || null,
        date: item.datePublished || new Date().toISOString(),
        url: item.jobUrl || item.url || "#",
        logoUrl: item.employer?.logoUrl || null,
        benefits: item.benefits ? Object.values(item.benefits) : [],
        createdAt: serverTimestamp(),
        importedAt: new Date().toISOString(), // Pour tracking
        apiKey: item.key // Pour éviter les doublons futurs
      };

      const docRef = await addDoc(collection(db, "offers"), offer);
      addedOffers.push({ id: docRef.id, ...offer });
    }

    return addedOffers;
    
  } catch (error) {
    throw error; // Re-lancer l'erreur pour que le composant puisse la gérer
  }
};