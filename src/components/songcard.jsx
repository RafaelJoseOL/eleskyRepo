import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faHeart, faPlus, faDownload } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import ReactGA from 'react-ga';

export const SongCard = ({ song, currSong, setCurrSong, isLogged, liked, handleLikedSong, 
    search, selectedTags, volumen, currentPage }) => {
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [duration, setDuration] = useState('00:00');

    useEffect(() => {
        handlePlayPause(false);
    }, [currentPage]);

    useEffect(() => {
        const pauseSong = async () => {
            setCurrSong(null);
            handlePlayPause(false);
        };
        pauseSong();
    }, [search, selectedTags]);

    useEffect(() => {
        const changeVolumen = async () => {
            audioRef.current.volume = volumen / 100;
        };
        changeVolumen();
    }, [volumen]);

    const setCurrentTimeFormat = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        setCurrentTime(formattedTime);
    };

    const handleLoadedMetadata = () => {
        const totalDuration = audioRef.current.duration;
        const minutes = Math.floor(totalDuration / 60);
        const seconds = Math.floor(totalDuration % 60);
        const formattedDuration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        setDuration(formattedDuration);
    };

    const handlePlayPause = (play) => {
        if (play) {
            if (currSong != null && audioRef != currSong.audioRef) {
                currSong.audioRef.current.pause();
            }
            setCurrSong({ ...song, audioRef });
            setIsPlaying(true);
            audioRef.current.play();
            ReactGA.event({
                category: 'Audio',
                action: 'Play Song',
                label: song.song_name
            });
        } else {
            setIsPlaying(false);
            audioRef.current.pause();
            ReactGA.event({
                category: 'Audio',
                action: 'Pause Song',
                label: song.song_name
            });
        }
    };

    const handleProgressClick = (e) => {
        const progressWidth = e.target.clientWidth;
        const clickOffsetX = e.nativeEvent.offsetX;
        const clickPercent = clickOffsetX / progressWidth;
        const newTime = clickPercent * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setCurrentTimeFormat(newTime);
        handlePlayPause(true);
    };

    return (
        <div className={`${isPlaying ? 'card cardPlaying' : 'card'}`}>
            <div className={`card__title`}>{song.song_name}</div>
            <div className="card__subtitle">{song.song_origin}</div>
            <div className="card__tags">{song.song_tags.join(', ')}</div>
            <div className="card__wrapper">
                <div className="card__time card__time-passed">{currentTime}</div>
                <div className="card__timeline progress-bar" onClick={handleProgressClick}>
                    <progress
                        value={audioRef.current ? audioRef.current.currentTime : 0}
                        max={audioRef.current ? audioRef.current.duration : 0}
                    />
                </div>
                <div className="card__time card__time-left">{duration}</div>
            </div>
            <div className="card__wrapper mx-auto">
                {/* {isLogged && (
                    <button className='playlistButton rounded-circle' id="like-song" onClick={() => handleAddToPlaylist(song.song_id)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                )} */}
                {isLogged && (
                    <button className='playlistButton rounded-circle' id={`${!liked ? "like" : "dislike"} ${song.song_name}`} onClick={() => handleLikedSong(song.song_id)}>
                        {!liked ? (
                            <FontAwesomeIcon icon={faHeartRegular} />
                        ) : (
                            <FontAwesomeIcon icon={faHeart} />
                        )}
                    </button>
                )}
                {(song.song_lore !== undefined && song.song_lore !== '') && (
                    <button className='fw-bolder playlistButton rounded-circle loreButton'>
                        !
                        <span class="loreText">{song.song_lore}</span>
                    </button>
                )}
                {!isPlaying ? (
                    <button className='playlistButton rounded-circle' id={`play ${song.song_name}`} onClick={() => handlePlayPause(true)}>
                        <FontAwesomeIcon icon={faPlay} />
                    </button>
                ) :
                    (
                        <button className='playlistButton rounded-circle' id={`pause ${song.song_name}`} onClick={() => handlePlayPause(false)}>
                            <FontAwesomeIcon icon={faPause} />
                        </button>
                    )}
                <button
                    className='playlistButton rounded-circle'
                    id="download-song"
                    onClick={() => { window.open(song.song_file, "_blank") }}>
                    <FontAwesomeIcon icon={faDownload} />
                </button>
                <audio
                    ref={audioRef}
                    src={song.song_file}
                    type="audio/mpeg"
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={() => setCurrentTimeFormat(audioRef.current.currentTime)}
                    onPause={() => handlePlayPause(false)}
                    onEnded={() => handlePlayPause(false)}
                />
            </div>
        </div>
    )
}

export default SongCard;