import React from 'react'
import { useState, useEffect } from 'react';
import { SongCardPlaylist } from '../../components/songcardPlaylist'

export const Playlist = ({ listOfSongs, isLogged, userLikedSongs, volumen, listOfTags, defaultTags }) => {
  const [randomizedSongs, setRandomizedSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [useEff, setUseEff] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    const shuffleAndSetRandomizedSongs = () => {
      const shuffledSongs = [...filteredSongs].sort(() => Math.random() - 0.5);
      setRandomizedSongs(shuffledSongs);
    };
    shuffleAndSetRandomizedSongs();
  }, [useEff]);

  const randomizeOrder = (tag) => {
    if (tag === "todo") {
      setFilteredSongs(listOfSongs);
    } else if (tag === "liked") {
      setFilteredSongs(listOfSongs.filter(song => userLikedSongs.includes(song.song_id)));
    } else {
      setFilteredSongs(listOfSongs.filter(song => song.song_tags.includes(tag)));
    }
    setUseEff(!useEff);
    setSelectedButton(tag);
  };

  return (
    <div className='col-10 mx-auto z-0 text-center'>
      <div className='mt-4'>
        {isLogged && (
          <button className={`col-4 mt-2 col-xl-2 mx-1 mx-xl-3 buttonPlaylist ${selectedButton === "liked" && 'buttonPlaylistSelected'}`} onClick={() => randomizeOrder("liked")}>Favoritas</button>
        )}
        <button className={`col-4 mt-2 col-xl-2 mx-1 mx-xl-3 buttonPlaylist ${selectedButton === "todo" && 'buttonPlaylistSelected'}`} onClick={() => randomizeOrder("todo")}>Todas</button>
        {defaultTags.map((tag, index) => (
          <button key={index} className={`col-4 mt-2 col-xl-2 mx-1 mx-xl-3 buttonPlaylist ${selectedButton === tag && 'buttonPlaylistSelected'}`} onClick={() => randomizeOrder(tag)}>{tag}</button>
        ))}
        {listOfTags.map((tag, index) => (
          <button className={`col-4 mt-2 col-xl-2 mx-1 mx-xl-3 buttonPlaylist ${selectedButton === tag && 'buttonPlaylistSelected'}`} onClick={() => randomizeOrder(tag)} key={index}>{tag}</button>
        ))}
      </div>
      <div className='my-4 d-flex justify-content-center'>
        {randomizedSongs.length > 0 && (
          <div>
            <SongCardPlaylist
              songs={randomizedSongs}
              volumen={volumen}
              useEff={useEff}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Playlist;