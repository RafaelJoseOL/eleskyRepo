import React, { useState, useEffect } from 'react';
import { SongCard } from '../../components/songcard'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from "../../config/firebase-config";

export const Home = ({ listOfSongs, isLogged, userID, userLikedSongs, setUserLikedSongs, volumen, loading, listOfTags }) => {
    const [search, setSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState({});
    const [currSong, setCurrSong] = useState(null);

    const filteredSongs = listOfSongs.filter((song) => {
        const matchesSearch = song.song_name.toLowerCase().includes(search.toLowerCase());
        const selectedTagKeys = Object.keys(selectedTags).filter(key => selectedTags[key]);
        const matchesTags = selectedTagKeys.length === 0 || selectedTagKeys.every(tag => song.song_tags.includes(tag));
        return matchesSearch && matchesTags;
    }).sort((a, b) => a.song_name.localeCompare(b.song_name));

    const handleLikedSong = async (songID) => {
        try {
            if (isLogged && userID) {
                const userDocRef = doc(db, 'users', userID);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const updatedLikedSongs = userLikedSongs.includes(songID)
                        ? userLikedSongs.filter((id) => id !== songID)
                        : [...userLikedSongs, songID];

                    setUserLikedSongs(updatedLikedSongs);

                    await updateDoc(userDocRef, { user_likedSongs: updatedLikedSongs });

                    console.log('Base de datos actualizada correctamente');
                }
            }
        } catch (error) {
            console.error('Error al actualizar la base de datos:', error);
        }
    };

    useEffect(() => {
        const fetchUserLikedSongs = async () => {
            if (isLogged) {
                try {
                    const docRef = doc(db, "users", userID);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        console.log(userData)
                        setUserLikedSongs(userData.user_likedSongs || []);
                    }
                } catch (error) {
                    console.error('Error al obtener las canciones que le gustan al usuario:', error);
                }
            }
        };
        fetchUserLikedSongs();
    }, [isLogged]);

    return (
        <div className='container-fluid mainHome'>
            <div className='row'>
                <div className='d-none d-md-block col-10 col-md-2 sideBar text-light ms-4 mt-3'>
                    <div className='searchBar mt-3 mx-auto'>
                        <input
                            type="text"
                            placeholder="Buscar por nombre"
                            value={search}
                            maxLength={20}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className='mt-2 mx-auto'>
                        <label>Tipo:</label>
                        <div className='mt-2'>
                            <div>
                                <label>
                                    <input type="checkbox" checked={selectedTags['Voz']} onChange={() => toggleTagFilter('Voz')} />
                                    <span className='ms-1'>Voz</span>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input type="checkbox" checked={selectedTags['Piano']} onChange={() => toggleTagFilter('Piano')} />
                                    <span className='ms-1'>Piano</span>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input type="checkbox" checked={selectedTags['Guitarra']} onChange={() => toggleTagFilter('Guitarra')} />
                                    <span className='ms-1'>Guitarra</span>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input type="checkbox" checked={selectedTags['Concierto']} onChange={() => toggleTagFilter('Concierto')} />
                                    <span className='ms-1'>Concierto</span>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input type="checkbox" checked={selectedTags['Oído']} onChange={() => toggleTagFilter('Oído')} />
                                    <span className='ms-1'>Oído</span>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input type="checkbox" checked={selectedTags['Mashup']} onChange={() => toggleTagFilter('Mashup')} />
                                    <span className='ms-1'>Mashups</span>
                                </label>
                            </div>
                            <br />
                            <label className='mb-2'>Sección:</label>
                            {listOfTags.map((tag, index) => (
                                <div key={index}>
                                    <label>
                                        <input type="checkbox" defaultChecked={selectedTags[tag]} onChange={() => toggleTagFilter(tag)} />
                                        <span className='ms-1'>{(tag)}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='d-md-none d-md-block mt-3'>
                    <p className='col-md-12 text-center'>
                        <button className="filterButton" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFilter" aria-expanded="false" aria-controls="collapseFilter">
                            Búsqueda/Filtro
                        </button>
                    </p>
                    <div className="collapse text-align-center" id="collapseFilter">
                        <div className='searchBar mt-3 mx-auto'>
                            <input
                                type="text"
                                placeholder="Buscar por nombre"
                                value={search}
                                maxLength={20}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className='mt-2 mx-auto'>
                            <label>Tipo:</label>
                            <div className='mt-2'>
                                <div>
                                    <label>
                                        <input type="checkbox" checked={selectedTags['Voz']} onChange={() => toggleTagFilter('Voz')} />
                                        <span className='ms-1'>Voz</span>
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input type="checkbox" checked={selectedTags['Piano']} onChange={() => toggleTagFilter('Piano')} />
                                        <span className='ms-1'>Piano</span>
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input type="checkbox" checked={selectedTags['Guitarra']} onChange={() => toggleTagFilter('Guitarra')} />
                                        <span className='ms-1'>Guitarra</span>
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input type="checkbox" checked={selectedTags['Concierto']} onChange={() => toggleTagFilter('Concierto')} />
                                        <span className='ms-1'>Concierto</span>
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input type="checkbox" checked={selectedTags['Mashup']} onChange={() => toggleTagFilter('Mashup')} />
                                        <span className='ms-1'>Mashups</span>
                                    </label>
                                </div>
                                <br />
                                <label className='mb-2'>Sección:</label>
                                {listOfTags.map((tag, index) => (
                                    <div key={index}>
                                        <label>
                                            <input type="checkbox" defaultChecked={selectedTags[tag]} onChange={() => toggleTagFilter(tag)} />
                                            <span className='ms-1'>{(tag)}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-8 songs mt-4 mx-auto'>
                    <div className='row'>
                        {filteredSongs.map((song, index) => (
                            <div className='song col-10 col-md-8 col-lg-7 col-xl-6 col-xxl-4 mx-auto song mb-4 d-flex flex-column align-items-center justify-content-center' key={index}>
                                <SongCard
                                    song={song}
                                    currSong={currSong}
                                    setCurrSong={setCurrSong}
                                    isLogged={isLogged}
                                    liked={userLikedSongs.includes(song.song_id)}
                                    handleLikedSong={handleLikedSong}
                                    search={search}
                                    selectedTags={selectedTags}
                                    volumen={volumen}
                                />
                            </div>
                        ))}
                        {(filteredSongs.length == 0 && !loading) && (
                            <div className='ms-5 mt-2 fw-bold'>
                                No hay canciones que coincidan con tu búsqueda.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

    function toggleTagFilter(tag) {
        setSelectedTags(prevTags => ({
            ...prevTags,
            [tag]: !prevTags[tag]
        }));
    }
}

export default Home;
