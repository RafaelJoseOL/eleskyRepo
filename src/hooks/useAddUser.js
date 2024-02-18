import { collection, serverTimestamp, doc, setDoc } from "firebase/firestore"
import { db } from "../config/firebase-config"

export const useAddUser = () => {
    const songsCollection = collection(db, "users");

    const addUser = async ({ user_id }) => {
        try {
            const data = {
                user_id: user_id,
                user_likedSongs: [],
                createdAt: serverTimestamp()
            };
            await setDoc(doc(db, "users", user_id), data);
        } catch (error) {
            console.error('Error al crear en la base de datos:', error);
        }
    };

    return { addUser };
};