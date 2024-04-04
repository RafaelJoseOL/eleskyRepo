import React from 'react'
import { useState } from 'react';
import { doc, setDoc, deleteField, updateDoc } from 'firebase/firestore';

export const MyPlaylists = ({ listOfSongs, isLogged, db, userID, userPlaylists, userPlaylistsCount, refreshPlaylists }) => {
    const [searchInput, setSearchInput] = useState("");
    const [playlistName, setPlaylistName] = useState("");
    const [playlistSongs, setPlaylistSongs] = useState([]);
    const [playlistSongsNames, setPlaylistSongsNames] = useState([]);
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [currPlaylistName, setCurrPlaylistName] = useState("");

    const handleSelectSong = (song) => {
        const updatedPlaylist = playlistSongs.includes(song.song_id)
            ? playlistSongs.filter((id) => id !== song.song_id)
            : [...playlistSongs, song.song_id];

        const updatedPlaylistNames = playlistSongsNames.includes(song.song_name)
            ? playlistSongsNames.filter((name) => name !== song.song_name)
            : [...playlistSongsNames, song.song_name];

        setPlaylistSongs(updatedPlaylist);
        setPlaylistSongsNames(updatedPlaylistNames);
    }

    const handleAddPlaylist = async () => {
        if (playlistName === "") {
            alert("Introduce un nombre para tu playlist.");
        } else if (playlistName.length >= 20) {
            alert("20 caracteres máximo");
        } else {
            try {
                if (isLogged && userID) {
                    const userDocRef = doc(db, 'usersPlaylists', userID);
                    await setDoc(userDocRef, {
                        [playlistName]: playlistSongs
                    }, { merge: true });

                    alert(`Playlist ${playlistName} creada con éxito`);

                    handleCancelPlaylist();
                    refreshPlaylists();
                }
            } catch (error) {
                console.error('Error al actualizar la base de datos:', error);
            }
        }
    };

    const findSongNameById = (songId) => {
        const song = listOfSongs.find(song => song.song_id === songId);
        if(song){
            return song.song_name;
        }
    };

    const editPlaylist = (playlistName, songIds) => {
        setPlaylistName(playlistName);
        setCurrPlaylistName(playlistName);
        setPlaylistSongs(songIds);
        const playlistSongsNames = songIds.map(songId => findSongNameById(songId));
        setPlaylistSongsNames(playlistSongsNames);
        setEditing(true);
    };

    const handleUpdatePlaylist = async () => {
        if (playlistName === "") {
            alert("Introduce un nombre para tu playlist.");
        }
        else if (playlistName.length >= 20) {
            alert("20 caracteres máximo");
        } else {
            try {
                if (isLogged && userID) {
                    const userDocRef = doc(db, 'usersPlaylists', userID);

                    if (playlistName !== currPlaylistName) {
                        await updateDoc(userDocRef, {
                            [currPlaylistName]: deleteField()
                        });
                    }
                    await setDoc(userDocRef, {
                        [playlistName]: playlistSongs
                    }, { merge: true });

                    alert(`Playlist ${playlistName} actualizada con éxito`);

                    finishEditing();
                    refreshPlaylists();
                }
            } catch (error) {
                console.error('Error al actualizar la base de datos:', error);
            }
        }
    };

    const handleDeletePlaylist = async () => {
        try {
            if (isLogged && userID) {
                const isConfirmed = window.confirm("¿Estás seguro de que quieres realizar esta acción?");
                if (isConfirmed) {
                    const userDocRef = doc(db, 'usersPlaylists', userID);

                    await updateDoc(userDocRef, {
                        [currPlaylistName]: deleteField()
                    });

                    alert(`Playlist ${playlistName} borrada con éxito`);

                    finishEditing();
                    refreshPlaylists();
                }
            }
        } catch (error) {
            console.error('Error al actualizar la base de datos:', error);
        }
    };

    const handleCancelPlaylist = () => {
        setSearchInput("");
        setPlaylistName("");
        setPlaylistSongs([]);
        setPlaylistSongsNames([]);
        setCreating(false);
    }

    const finishEditing = () => {
        setSearchInput("");
        setPlaylistName("");
        setPlaylistSongs([]);
        setPlaylistSongsNames([]);
        setEditing(false);
    }

    return (
        <div className='col-12 text-center'>
            {editing ? (
                <div className='row mx-auto mb-5 mt-4' id="addPlaylistForm">
                    <div className='col-10 col-lg-6 mx-auto'>
                        <form className="text-align-center mt-3 col-12 col-lg-6 z-0 mx-auto">
                            <div className="form-group">
                                <input type="text" value={playlistName} className="form-control mt-3" id="playlistName" onChange={event => setPlaylistName(event.target.value)} placeholder="Introduce el nombre de la playlist" />
                            </div>
                            <div className="form-group">
                                <input type="text" value={searchInput} className="form-control mt-3" id="searchSong" placeholder="Buscar canciones" onChange={event => setSearchInput(event.target.value)} />
                                {searchInput !== "" && (
                                    <ul className="list-group mt-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        {listOfSongs.filter(song => song.song_name.toLowerCase().includes(searchInput.toLowerCase()) || song.song_origin.toLowerCase().includes(searchInput.toLowerCase())).map((song, index) => (
                                            <li key={index}
                                                className={`list-group-item ${playlistSongs.includes(song.song_id) && 'selected-group-item'}`}
                                                onClick={() => handleSelectSong(song)}>
                                                {song.song_name} - {song.song_origin}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className='d-flex flex-column col-6 mx-auto'>
                                <button type="button" className="btn btn-primary mt-3 position-relative z-0" onClick={handleUpdatePlaylist}>Finalizar</button>
                                <button type="button" className="btn btn-primary mt-3 position-relative z-0" onClick={handleDeletePlaylist}>Borrar</button>
                                <button type="button" className="btn btn-primary mt-3 position-relative z-0" onClick={finishEditing}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <div className='col-9 col-lg-3 mx-auto mt-3 mb-5 card' style={{ maxHeight: '510px', overflowY: 'auto' }}>
                        <h3>Canciones {playlistName}:</h3>
                        {playlistSongsNames.map((song, index) => (
                            <div key={index}>
                                {song}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    {userPlaylistsCount < 5 ? (
                        <div className='mt-4'>
                            {!creating && (
                                <button className="filterButton" type="button" onClick={() => setCreating(true)}>
                                    Crear Playlist
                                </button>
                            )}
                            {creating && (
                                <div className='row mx-auto mb-5 mt-4' id="addPlaylistForm">
                                    <div className='col-10 col-lg-6 mx-auto'>
                                        <form className="text-align-center mt-3 col-12 col-lg-6 z-0 mx-auto">
                                            <div className="form-group">
                                                <input type="text" value={playlistName} className="form-control mt-3" id="playlistName" onChange={event => setPlaylistName(event.target.value)} placeholder="Introduce el nombre de la playlist" />
                                            </div>
                                            <div className="form-group">
                                                <input type="text" value={searchInput} className="form-control mt-3" id="searchSong" placeholder="Buscar canciones" onChange={event => setSearchInput(event.target.value)} />
                                                {searchInput !== "" && (
                                                    <ul className="list-group mt-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                        {listOfSongs.filter(song => song.song_name.toLowerCase().includes(searchInput.toLowerCase()) || song.song_origin.toLowerCase().includes(searchInput.toLowerCase())).map((song, index) => (
                                                            <li key={index}
                                                                className={`list-group-item ${playlistSongs.includes(song.song_id) && 'selected-group-item'}`}
                                                                onClick={() => handleSelectSong(song)}>
                                                                {song.song_name} - {song.song_origin}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            <div className='d-flex flex-column col-6 mx-auto'>
                                                <button type="button" className="btn btn-primary mt-3 position-relative z-0" onClick={handleAddPlaylist}>Finalizar</button>
                                                <button type="button" className="btn btn-primary mt-3 position-relative z-0" onClick={handleCancelPlaylist}>Cancelar</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className='col-9 col-lg-3 mx-auto mt-3 mb-5 card' style={{ maxHeight: '510px', overflowY: 'auto' }}>
                                        <h3>Canciones {playlistName}:</h3>
                                        {playlistSongsNames.map((song, index) => (
                                            <div key={index}>
                                                {song}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='mb-4 mt-4'>
                            <h3>Máximo de playlists alcanzado.</h3>
                        </div>
                    )}
                </div>
            )}
            {!editing && !creating && (
                <div className='d-flex flex-column mb-4'>
                    {Object.entries(userPlaylists).map(([playlistName, songIds]) => (
                        <div key={playlistName} className='mt-4 card mx-auto col-9 col-lg-3'  style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <button className='col-3 mx-auto mb-3 filterButton'
                                onClick={() => editPlaylist(playlistName, songIds)}>Editar
                            </button>
                            <h3>{playlistName}</h3>
                            <div>
                                {songIds.map((songId, index) => (
                                    <div key={index}>{findSongNameById(songId)}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyPlaylists