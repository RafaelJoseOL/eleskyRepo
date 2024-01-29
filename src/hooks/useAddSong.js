import { addDoc, collection, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from "../config/firebase-config"

export const useAddSong = () => {
    const songsCollection = collection(db, "songs");

    const addSong = async ({ song_name, song_tags, song_file }) => {
        try {
            const storageRef = ref(storage, `songs/${song_name}`);
            await uploadBytes(storageRef, song_file);

            const downloadURL = await getDownloadURL(storageRef);

            const lastSongDoc = await getDoc(doc(db, "metadata", "songs"));
            const lastSongID = lastSongDoc.exists() ? lastSongDoc.data().lastSongID : -1;
            const newSongID = lastSongID + 1;

            await addDoc(songsCollection, {
                song_id: newSongID,
                song_name: song_name,
                song_tags: song_tags,
                song_file: downloadURL,
                createdAt: serverTimestamp()
            });

            await setDoc(doc(db, "metadata", "songs"), {
                lastSongID: newSongID,
            });
        } catch (error) {
            console.error('Error al subir el archivo o guardar en la base de datos:', error);
        }
    };

    return { addSong };
};