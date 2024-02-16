import React from 'react'
import { useState, useEffect } from 'react';
import { SongCardPlaylist } from '../../components/songcardPlaylist'

export const Playlist = ({ listOfSongs }) => {
  const [randomizedSongs, setRandomizedSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [useEff, setUseEff] = useState(false);
  const [currSong, setCurrSong] = useState(0);

  useEffect(() => {
    const shuffleAndSetRandomizedSongs = () => {
      const shuffledSongs = [...filteredSongs].sort(() => Math.random() - 0.5);
      setRandomizedSongs(shuffledSongs);
    };
    shuffleAndSetRandomizedSongs();
  }, [useEff]);

  const nextSong = () => {
    setCurrSong(currSong + 1);
    console.log(currSong)
  }

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
      default:
        break;
    }
    setUseEff(!useEff);
  };

  return (
    <div className='col-10 mx-auto'>
      <div className='d-flex justify-content-center mt-4'>
        <button className='col-12 col-xl-1 mx-3' onClick={() => randomizeOrder("todo")}>Todas</button>
        <button className='col-12 col-xl-1 mx-3' onClick={() => randomizeOrder("piano")}>Solo piano</button>
        <button className='col-12 col-xl-1 mx-3' onClick={() => randomizeOrder("voz")}>Voz</button>
      </div>
      <div className='mt-4 d-flex justify-content-center'>
        {randomizedSongs.length > 0 && (
          <div>
            <SongCardPlaylist
              song={randomizedSongs[currSong]}
              nextSong={nextSong}
            />
            {randomizedSongs.map(song => (
              <div key={song.song_id}>{song.song_name}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Playlist