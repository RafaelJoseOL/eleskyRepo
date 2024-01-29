import { useState, useEffect } from 'react';
import { collection, getDocs, query, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from "../../config/firebase-config";
import { ref, getDownloadURL } from 'firebase/storage';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export const Home = () => {
    const [listOfSongs, setListOfSongs] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const q = query(collection(db, "songs"));
                const querySnapshot = await getDocs(q);
                const songsData = querySnapshot.docs.map((doc) => {
                    return {
                        song_id: doc.data().song_id,
                        song_name: doc.data().song_name,
                        song_tags: doc.data().song_tags,
                        song_file: doc.data().song_file
                    };
                });
                setListOfSongs(songsData);
            } catch (error) {
                console.error('Error al obtener las canciones:', error);
            }
        };
        fetchSongs();
    }, []);

    const filteredSongs = listOfSongs.filter((song) => {
        const matchesSearch = song.song_name.toLowerCase().includes(search.toLowerCase());
        const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => song.song_tags.includes(tag));
        return matchesSearch && matchesTags;
    });

    return (
        <div className='container-fluid mainHome'>
            <div className='row'>
                <div className='d-none d-md-block col-md-2 sideBar text-light d-flex flex-column justify-content-top ms-3 mt-3'>
                    <div className='searchBar mt-3'>
                        <input
                            type="text"
                            placeholder="Buscar por nombre"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className='mt-2'>
                        <label>Filtrar:</label>
                        <div className='mt-2'>
                            <label>
                                <input type="checkbox" checked={selectedTags.includes('Piano')} onChange={() => toggleTagFilter('Piano')} />
                                <span className='ms-1'>Solo piano</span>
                            </label>
                            <label className='mx-3'>
                                <input type="checkbox" checked={selectedTags.includes('Voz')} onChange={() => toggleTagFilter('Voz')} />
                                <span className='ms-1'>Voz</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className='d-md-none d-md-block mt-3'>
                    {/* Responsive */}
                </div>
                <div className='col-8 songs mt-3 mx-auto'>
                    <div className='row'>
                        {filteredSongs.map((song, index) => (
                            <div className='song col-6 col-md-4 song mb-4 d-flex flex-column align-items-center justify-content-center' key={index}>
                                <div className='row col-12'>
                                    <div className='songName col-11 text-center align-items-center d-flex flex-column justify-content-center'>
                                        {song.song_name}
                                    </div>
                                    <button
                                        className='Btn btn-primary col-1'
                                        onClick={() => {
                                            const a = document.createElement('a');
                                            const songRef = ref(storage, song.song_file)
                                            getDownloadURL(songRef)
                                                .then((url) => {
                                                    a.href = url;
                                                    a.download = `${song.song_name}.mp3`;
                                                    a.target = "_blank"
                                                    a.click();
                                                })
                                                .catch((error) => {
                                                    switch (error.code) {
                                                        case 'storage/object-not-found':
                                                            break;
                                                        case 'storage/unauthorized':
                                                            break;
                                                        case 'storage/canceled':
                                                            break;
                                                        case 'storage/unknown':
                                                            break;
                                                    }
                                                })
                                        }}
                                    >
                                        <svg class="svgIcon" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></svg>
                                        <span class="icon2"></span>
                                        <span class="tooltip">Download</span>
                                    </button>
                                </div>
                                <AudioPlayer
                                    className='col-12'
                                    hasDefaultKeyBindings={false}
                                    src={song.song_file}
                                    autoPlayAfterSrcChange={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

    function toggleTagFilter(tag) {
        if (selectedTags.includes(tag)) {
            setSelectedTags([]);
        } else {
            setSelectedTags([tag]);
        }
    }
}

export default Home;