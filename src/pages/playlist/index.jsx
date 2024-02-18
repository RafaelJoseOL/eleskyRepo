import React from 'react'
import { useState, useEffect } from 'react';
import { SongCardPlaylist } from '../../components/songcardPlaylist'

export const Playlist = ({ listOfSongs, isLogged, userLikedSongs, volumen }) => {
  const [randomizedSongs, setRandomizedSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [useEff, setUseEff] = useState(false);

  useEffect(() => {
    const shuffleAndSetRandomizedSongs = () => {
      const shuffledSongs = [...filteredSongs].sort(() => Math.random() - 0.5);
      setRandomizedSongs(shuffledSongs);
    };
    shuffleAndSetRandomizedSongs();
  }, [useEff]);

  const randomizeOrder = (tag) => {
    switch (tag) {
      case 'todo':
        setFilteredSongs(listOfSongs);
        break;
      case 'piano':
        setFilteredSongs(listOfSongs.filter(song => song.song_tags.includes("Piano")));
        break;
      case 'voz':
        setFilteredSongs(listOfSongs.filter(song => song.song_tags.includes("Voz")));
        break;
      case 'liked':
        setFilteredSongs(listOfSongs.filter(song => userLikedSongs.includes(song.song_id)));
      default:
        break;
    }
    setUseEff(!useEff);
  };

  return (
    <div className='col-10 mx-auto'>
      <div className='d-flex justify-content-center mt-4'>
        <button className='col-3 col-xl-1 mx-1 mx-xl-3 buttonPlaylist' onClick={() => randomizeOrder("todo")}>Todas</button>
        <button className='col-3 col-xl-1 mx-1 mx-xl-3 buttonPlaylist' onClick={() => randomizeOrder("piano")}>Solo piano</button>
        <button className='col-3 col-xl-1 mx-1 mx-xl-3 buttonPlaylist' onClick={() => randomizeOrder("voz")}>Voz</button>
        {isLogged && (
          <button className='col-3 col-xl-1 mx-1 mx-xl-3 buttonPlaylist' onClick={() => randomizeOrder("liked")}>Me gustan</button>
        )}
      </div>
      <div className='my-4 d-flex justify-content-center'>
        {randomizedSongs.length > 0 && (
          <div>
            <SongCardPlaylist
              songs={randomizedSongs}
              volumen={volumen}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Playlist;