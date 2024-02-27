import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from "../config/firebase-config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faForward, faBackward, faDownload } from '@fortawesome/free-solid-svg-icons'

export const SongCardPlaylist = ({ songs, volumen }) => {
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [duration, setDuration] = useState('00:00');
    const [currSong, setCurrSong] = useState(0);

    useEffect(() => {
        const changeVolumen = async () => {
            audioRef.current.volume = volumen / 100;
        };
        changeVolumen();
    }, [volumen]);

    const changeSong = (next) => {
        if (next >= songs.length) {
            setCurrSong(0);
        } else if (next < 0) {
            setCurrSong(songs.length - 1);
        } else {
            setCurrSong(next);
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

    const handleChangeSong = (next) => {
        handlePlayPause(false);
        changeSong(next);
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
                    <button className='playlistButton rounded-circle' id="previous-song" onClick={() => handleChangeSong(currSong - 1)}><FontAwesomeIcon icon={faBackward} /></button>
                    {!isPlaying ? (
                        <button className='playlistButton rounded-circle' id="play" onClick={() => handlePlayPause(true)}><FontAwesomeIcon icon={faPlay} /></button>
                    ) : (
                        <button className='playlistButton rounded-circle' id="play" onClick={() => handlePlayPause(false)}><FontAwesomeIcon icon={faPause} /></button>
                    )}
                    <button className='playlistButton rounded-circle' id="next-song" onClick={() => handleChangeSong(currSong + 1)}><FontAwesomeIcon icon={faForward} /></button>
                    <button className='playlistButton rounded-circle' id="download-song" onClick={() => {
                        const a = document.createElement('a');
                        const songRef = ref(storage, songs[currSong].song_file)
                        getDownloadURL(songRef)
                            .then((url) => {
                                a.href = url;
                                a.download = `${songs[currSong].song_name}.mp3`;
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
                                    default:
                                        break;
                                }
                            })
                    }}><FontAwesomeIcon icon={faDownload}
                        />
                    </button>
                    <audio
                        ref={audioRef}
                        src={songs[currSong].song_file}
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={() => setCurrentTimeFormat(audioRef.current.currentTime)}
                        onPause={() => handlePlayPause(false)}
                        onEnded={() => handleChangeSong(currSong + 1)}
                    />
                </div>
            </div>

            <div className='mt-4 card'>
                {songs.map((song, index) => (
                    <div key={song.song_id}>
                        <span className='playlistElement' onClick={() => handleChangeSong(index)}>{index + 1} - {song.song_name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SongCardPlaylist;