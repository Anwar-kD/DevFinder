import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {db} from "../config/firebase";
import {useGetUserInfo} from "./useGetUserInfo";

interface TransactionData {
  description: string;
  transactionAmount: number;
  transactionType: string;
}

export const useAddTransaction = () => {
    const transactionCollectionRef  = collection(db, "transactions");
    const {userID} = useGetUserInfo();

    const addTransaction = async ({description,transactionAmount,transactionType}:TransactionData): Promise<void> =>{
        await addDoc(transactionCollectionRef , {
            userID,
            description,
            transactionAmount,
            transactionType,
            createdAt: serverTimestamp()
        });
    }
    return {addTransaction};
}