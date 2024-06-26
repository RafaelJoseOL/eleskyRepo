import { serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../config/firebase-config"

export const useAddSong = () => {
    const addSong = async ({ song_name, song_origin, song_link, song_tags, song_lore }) => {
        try {
            var oldLink = song_link;
            var newLink = oldLink.slice(0, -4);
            newLink += "raw=1";
            const modifiedLink = newLink.replace("www.dropbox.com", "dl.dropboxusercontent.com"); 

            const lastSongDoc = await getDoc(doc(db, "metadata", "songs"));
            const lastSongID = lastSongDoc.exists() ? lastSongDoc.data().lastSongID : -1;
            const newSongID = lastSongID + 1;

            await setDoc(doc(db, "songsDocs", song_name), {
                song_id: newSongID,
                song_name: song_name,
                song_origin: song_origin,
                song_file: newLink,
                song_link_new: modifiedLink,
                song_tags: song_tags,
                song_lore: song_lore,
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