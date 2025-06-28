import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { useGetUserInfo } from "./useGetUserInfo";

// Define a type for a transaction
interface Transaction {
  id: string;
  description: string;
  transactionAmount: number;
  transactionType: string;
  createdAt: any; // Firebase Timestamp
}
interface TransactionTools {
    balance: number;
    expenses :number;
    income : number;
}


export const useGetTransaction = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionTotals, setTransactionTotals] = useState<TransactionTools>({balance: 0.0,expenses: 0.0,income: 0.0,});
  const transactionsRef = collection(db, "transactions");
  const { userID } = useGetUserInfo();

  const getTransactions = (): (() => void) | undefined  => {
    if (!userID) return undefined;

    const q = query(
      transactionsRef,
      where("userID", "==", userID),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: Transaction[] = [];
      let totalIncome = 0;
      let totalExpenses = 0;
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Transaction);
        doc.data().transactionType === "expense" ? totalExpenses+= Number(doc.data().transactionAmount) : totalIncome+= Number(doc.data().transactionAmount);
      });
      let balance = totalIncome - totalExpenses;
      setTransactions(items);
      setTransactionTotals({balance,expenses: totalExpenses,income: totalIncome});
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = getTransactions();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userID]); // Rerun when userID is available

  return { transactions, transactionTotals };
};
