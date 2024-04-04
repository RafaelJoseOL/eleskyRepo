import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from "../config/firebase-config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward, faDownload } from '@fortawesome/free-solid-svg-icons';
import { logEvent } from "firebase/analytics";

export const SongCardPlaylist = ({ songs, volumen, useEff, analytics, currSong, setCurrSong }) => {
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [duration, setDuration] = useState('00:00');

    useEffect(() => {
        logEvent(analytics, 'playSong', { name: songs[0].song_name, value: songs[0].song_id });
    }, []);

    useEffect(() => {
        handlePlayPause(false);
    }, [useEff]);

    useEffect(() => {
        const changeVolumen = async () => {
            audioRef.current.volume = volumen / 100;
        };
        changeVolumen();
    }, [volumen]);

    const changeSong = (next, skip) => {
        if (skip) {
            logEvent(analytics, 'skipSong', { name: songs[currSong].song_name, value: songs[currSong].song_id });
        }
        if (next >= songs.length) {
            setCurrSong(0);
            logEvent(analytics, 'playSong', { name: songs[0].song_name, value: songs[0].song_id });
        } else if (next < 0) {
            setCurrSong(songs.length - 1);
            logEvent(analytics, 'playSong', { name: songs[songs.length - 1].song_name, value: songs[songs.length - 1].song_id });
        } else {
            setCurrSong(next);
            logEvent(analytics, 'playSong', { name: songs[next].song_name, value: songs[next].song_id });
        }
    }

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

    const handleProgressClick = (e) => {
        const progressWidth = e.target.clientWidth;
        const clickOffsetX = e.nativeEvent.offsetX;
        const clickPercent = clickOffsetX / progressWidth;
        const newTime = clickPercent * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setCurrentTimeFormat(newTime);
    };

    const handlePlayPause = (play) => {
        if (play) {
            setIsPlaying(true);
            audioRef.current.play();
        } else {
            setIsPlaying(false);
            audioRef.current.pause();
        }
    };

    const handleChangeSong = (next, skip) => {
        handlePlayPause(false);
        changeSong(next, skip);
        setTimeout(() => {
            handlePlayPause(true);
        }, 200);
    };

    return (
        <div>
            <div className="card">
                <div className="card__title">{songs[currSong].song_name}</div>
                <div className="card__subtitle">{songs[currSong].song_origin}</div>
                <div className="card__tags">{songs[currSong].song_tags.join(', ')}</div>
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
                    <button className='playlistButton rounded-circle' id="previous-song" onClick={() => handleChangeSong(currSong - 1, true)}><FontAwesomeIcon icon={faBackward} /></button>
                    {/* {songs[currSong].song_lore !== undefined && (
                        <button className='fw-bolder playlistButton rounded-circle loreButton'>
                            !
                            <span class="loreTextPlaylist">{songs[currSong].song_lore}</span>
                        </button>
                    )} */}
                    {!isPlaying ? (
                        <button className='playlistButton rounded-circle' id={`play ${songs[currSong].song_name}`} onClick={() => handlePlayPause(true)}><FontAwesomeIcon icon={faPlay} /></button>
                    ) : (
                        <button className='playlistButton rounded-circle' id={`pause ${songs[currSong].song_name}`} onClick={() => handlePlayPause(false)}><FontAwesomeIcon icon={faPause} /></button>
                    )}
                    <button className='playlistButton rounded-circle' id={`skip ${songs[currSong].song_name}`} onClick={() => handleChangeSong(currSong + 1, true)}><FontAwesomeIcon icon={faForward} /></button>
                    <button
                        className='playlistButton rounded-circle'
                        id="download-song"
                        onClick={() => { window.open(songs[currSong].song_file, "_blank") }}>
                        <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <audio
                        ref={audioRef}
                        src={songs[currSong].song_file}
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={() => setCurrentTimeFormat(audioRef.current.currentTime)}
                        onPause={() => handlePlayPause(false)}
                        onEnded={() => handleChangeSong(currSong + 1, false)}
                    />
                </div>
            </div>

            <div className='mt-4 card' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {songs.map((song, index) => (
                    <div key={song.song_id}>
                        <span
                            className={`playlistElement ${currSong === index ? 'text-dark' : ''}`}
                            onClick={() => handleChangeSong(index, true)}
                        >
                            {index + 1} - {currSong === index ? <strong>{song.song_name}</strong> : song.song_name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SongCardPlaylist;