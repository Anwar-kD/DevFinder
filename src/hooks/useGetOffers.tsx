import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../config/firebase-config";


interface Offer{
  key: string;
  title: string;
  url: string;
  jobUrl: string;
  date: string;
  description: { text: string };
  employer: { name: string; logoUrl?: string };
  location: { city?: string } | null;
  benefits?: Record<string, string>;
}

export const useGetOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const offerRef = collection(db, "offers");
  

  const getOffers= (): (() => void) | undefined  => {

    const q = query(
      offerRef,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const offers: Offer[] = [];
      querySnapshot.forEach((doc) => {
        offers.push({ key: doc.id, ...doc.data() } as Offer);
      });
      setOffers(offers);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = getOffers();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []); 

  return { offers };
};
