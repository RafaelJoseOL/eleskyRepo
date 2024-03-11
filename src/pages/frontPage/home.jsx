import React, { useState, useEffect } from 'react';
import { SongCard } from '../../components/songcard';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase-config';

export const Home = ({
    listOfSongs,
    isLogged,
    userID,
    userLikedSongs,
    setUserLikedSongs,
    volumen,
    loading,
    listOfTags,
    defaultTags,
}) => {
    const [search, setSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState({});
    const [currSong, setCurrSong] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [songsPerPage, setSongsPerPage] = useState(12);
    const [showFavorites, setShowFavorites] = useState(false);
    const [sortOrder, setSortOrder] = useState('nombre');

    const changePage = (index) => {
        setCurrentPage(index + 1);
    };

    const filteredSongs = listOfSongs.filter((song) => {
        const matchesSearch = song.song_name.toLowerCase().includes(search.toLowerCase())
            || song.song_origin.toLowerCase().includes(search.toLowerCase());
        const selectedTagKeys = Object.keys(selectedTags).filter((key) => selectedTags[key]);
        const matchesTags = selectedTagKeys.length === 0 || selectedTagKeys.every((tag) => song.song_tags.includes(tag));
        const isFavorite = !showFavorites || userLikedSongs.includes(song.song_id);

        return matchesSearch && matchesTags && isFavorite;
    }).sort((a, b) => {
        if (sortOrder === 'fecha') {
            const dateA = new Date(a.song_date.seconds * 1000);
            const dateB = new Date(b.song_date.seconds * 1000);
            return dateB - dateA;
        } else if (sortOrder === 'fechaInv') {
            const dateA = new Date(a.song_date.seconds * 1000);
            const dateB = new Date(b.song_date.seconds * 1000);
            return dateA - dateB;
        } else {
            return a.song_name.localeCompare(b.song_name);
        }
    });

    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedTags, songsPerPage, sortOrder]);

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
                }
            }
        } catch (error) {
            console.error('Error al actualizar la base de datos:', error);
        }
    };

    return (
        <div className='container-fluid mainHome'>
            <div className='row'>
                {/* Filtros PC */}
                <div className='d-none d-md-block col-10 col-md-2 sideBar text-light ms-4 mt-3'>
                    <div className='sortSelect col-12 col-xl-6'>
                        <span className='fw-bold'>Ordenar por: </span>
                        <select
                            className="form-select"
                            onChange={(e) => setSortOrder(e.target.value)}
                            defaultValue="nombre"
                        >
                            <option value="nombre">Alfabético</option>
                            <option value="fecha">Recientes</option>
                            <option value="fechaInv">Antiguas</option>
                        </select>
                    </div>
                    <div className='searchBar mt-3'>
                        <input
                            className='col-12 col-xl-6'
                            type="text"
                            placeholder=" Buscar..."
                            value={search}
                            maxLength={20}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className='mt-4 mx-auto'>
                        <div>
                            <div className='tagCheckbox'>
                                <label>
                                    <input type="checkbox" value={showFavorites} onChange={() => setShowFavorites(!showFavorites)} />
                                    <span>Favoritas</span>
                                </label>
                            </div>
                            {defaultTags.map((tag, index) => (
                                <div key={index} className='tagCheckbox'>
                                    <label>
                                        <input type="checkbox" value={selectedTags[tag]} onChange={() => toggleTagFilter(tag)} />
                                        <span>{tag}</span>
                                    </label>
                                </div>
                            ))}
                            <br />
                            {listOfTags.map((tag, index) => (
                                <div key={index} className='tagCheckbox' >
                                    <label>
                                        <input type="checkbox" value={selectedTags[tag]} onChange={() => toggleTagFilter(tag)} />
                                        <span>{(tag)}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Filtros móvil/tablet */}
                <div className='d-md-none mt-3'>
                    <p className='col-md-12 text-center'>
                        <button className="filterButton" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFilter" aria-expanded="false" aria-controls="collapseFilter">
                            Búsqueda/Filtro
                        </button>
                    </p>
                    <div className="collapse text-align-center" id="collapseFilter">
                        <div className='sortSelect col-6 mx-auto'>
                            <span className='fw-bold'>Ordenar por: </span>
                            <select
                                className="form-select d-flex"
                                onChange={(e) => setSortOrder(e.target.value)}
                                defaultValue="nombre"
                            >
                                <option value="nombre">Alfabético</option>
                                <option value="fecha">Recientes</option>
                                <option value="fechaInv">Antiguas</option>
                            </select>
                        </div>
                        <div className='searchBar mt-3 d-flex justify-content-center'>
                            <input
                                type="text"
                                placeholder="Buscar por nombre"
                                value={search}
                                maxLength={20}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className='mt-4 mx-auto'>
                            <div>
                                {defaultTags.map((tag, index) => (
                                    <div key={index} className='tagCheckbox col-9 mx-auto' >
                                        <label key={index}>
                                            <input type="checkbox" value={selectedTags[tag]} onChange={() => toggleTagFilter(tag)} />
                                            <span>{tag}</span>
                                        </label>
                                    </div>
                                ))}
                                <br />
                                {listOfTags.map((tag, index) => (
                                    <div key={index} className='tagCheckbox col-9 mx-auto' >
                                        <label>
                                            <input type="checkbox" value={selectedTags[tag]} onChange={() => toggleTagFilter(tag)} />
                                            <span>{(tag)}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-9 songs mt-4 mx-auto'>
                    {/* Paginación superior */}
                    <nav>
                        <div className='col-12 col-lg-4 mx-auto mb-3 d-flex flex-column text-center align-items-center justify-content-center'>
                            <label className='navbar-brand'>Canciones por página: </label>
                            <select name="songsPerPageSelect" value={songsPerPage} onChange={(event) => setSongsPerPage(event.target.value)}>
                                <option value="12">12</option>
                                <option value="24">24</option>
                                <option value="36">36</option>
                                <option value="48">48</option>
                            </select>
                        </div>
                        <ul className='pagination justify-content-center'>
                            {Array.from({ length: Math.ceil(filteredSongs.length / songsPerPage) }).map((_, index) => {
                                const isCurrent = currentPage === index + 1;
                                const isFirst = index === 0;
                                const isLast = index === Math.ceil(filteredSongs.length / songsPerPage) - 1;
                                const showPage = isFirst || isLast || Math.abs(currentPage - (index + 1)) <= 2;
                                const pageCount = Math.ceil(filteredSongs.length / songsPerPage);

                                if (showPage || (pageCount <= 5 && index < pageCount)) {
                                    return (
                                        <li key={index} className={`page-item ${isCurrent ? 'active' : ''}`}>
                                            <button
                                                className='page-link'
                                                onClick={() => changePage(index)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    );
                                } else if ((index === 1 && !isFirst) || (index === Math.ceil(filteredSongs.length / songsPerPage) - 2 && !isLast)) {
                                    return (
                                        <li key={index} className="page-item">
                                            <input
                                                type="number"
                                                className="page-link fst-italic text-muted"
                                                style={{ width: "50px", textAlign: "center" }}
                                                placeholder="..."
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const pageNumber = parseInt(e.target.value);
                                                        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= Math.ceil(filteredSongs.length / songsPerPage)) {
                                                            changePage(pageNumber - 1);
                                                        }
                                                    }
                                                }}
                                            />
                                        </li>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </ul>
                    </nav>
                    {/* Canciones */}
                    <div className='row'>
                        {currentSongs.map((song, index) => (
                            <div
                                className='song col-10 col-md-8 col-lg-7 col-xl-6 col-xxl-4 mx-auto song mb-4 d-flex flex-column align-items-center justify-content-center'
                                key={index}
                            >
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
                                    currentPage={currentPage}
                                />
                            </div>
                        ))}
                        {(currentSongs.length === 0 && !loading) && (
                            <div className='ms-5 mt-2 fw-bold'>
                                No hay canciones que coincidan con tu búsqueda.
                            </div>
                        )}
                    </div>
                    {/* Paginación inferior */}
                    <nav>
                        <div className='col-12 col-lg-4 mx-auto mb-3 d-flex flex-column text-center align-items-center justify-content-center'>
                            <label className='navbar-brand'>Canciones por página: </label>
                            <select name="songsPerPageSelect" value={songsPerPage} onChange={(event) => setSongsPerPage(event.target.value)}>
                                <option value="12">12</option>
                                <option value="24">24</option>
                                <option value="36">36</option>
                                <option value="48">48</option>
                            </select>
                        </div>
                        <ul className='pagination justify-content-center'>
                            {Array.from({ length: Math.ceil(filteredSongs.length / songsPerPage) }).map((_, index) => {
                                const isCurrent = currentPage === index + 1;
                                const isFirst = index === 0;
                                const isLast = index === Math.ceil(filteredSongs.length / songsPerPage) - 1;
                                const showPage = isFirst || isLast || Math.abs(currentPage - (index + 1)) <= 2;
                                const pageCount = Math.ceil(filteredSongs.length / songsPerPage);

                                if (showPage || (pageCount <= 5 && index < pageCount)) {
                                    return (
                                        <li key={index} className={`page-item ${isCurrent ? 'active' : ''}`}>
                                            <button
                                                className='page-link'
                                                onClick={() => changePage(index)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    );
                                } else if ((index === 1 && !isFirst) || (index === Math.ceil(filteredSongs.length / songsPerPage) - 2 && !isLast)) {
                                    return (
                                        <li key={index} className="page-item">
                                            <input
                                                type="number"
                                                className="page-link fst-italic text-muted"
                                                style={{ width: "50px", textAlign: "center" }}
                                                placeholder="..."
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const pageNumber = parseInt(e.target.value);
                                                        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= Math.ceil(filteredSongs.length / songsPerPage)) {
                                                            changePage(pageNumber - 1);
                                                        }
                                                    }
                                                }}
                                            />
                                        </li>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </ul>
                    </nav>
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
