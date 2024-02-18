import React from 'react'
import { useRef, useState } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from "../config/firebase-config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faHeart, faHeartBroken, faDownload } from '@fortawesome/free-solid-svg-icons'

export const SongCard = ({ song, currSong, setCurrSong, isLogged, liked, handleLikedSong }) => {
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [duration, setDuration] = useState('00:00');

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
            if (currSong != null) {
                currSong.audioRef.current.pause()
            }
            setCurrSong({ ...song, audioRef });
            setIsPlaying(true);
            audioRef.current.play();
        } else {
            setIsPlaying(false);
            audioRef.current.pause();
        }
    };

    const handleProgressClick = (e) => {
        const progressWidth = e.target.clientWidth;
        const clickOffsetX = e.nativeEvent.offsetX;
        const clickPercent = clickOffsetX / progressWidth;
        const newTime = clickPercent * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setCurrentTimeFormat(newTime);
    };

    return (
        <div className="card">
            <div className="card__title">{song.song_name}</div>
            <div className="card__subtitle">{song.song_tags.join(', ')}</div>
            <div className="card__wrapper">
                <div className="card__time card__time-passed">{currentTime}</div>
                <div className="card__timeline" onClick={handleProgressClick}>
                    <progress
                        value={audioRef.current ? audioRef.current.currentTime : 0}
                        max={audioRef.current ? audioRef.current.duration : 0}
                    />
                </div>
                <div className="card__time card__time-left">{duration}</div>
            </div>
            <div className="card__wrapper mx-auto">
                {isLogged && (
                    <div>
                        <button className='playlistButton' id="like-song" onClick={() => handleLikedSong(song.song_id)}>
                            {liked ? (
                                <FontAwesomeIcon icon={faHeartBroken} />
                            ) : (
                                <FontAwesomeIcon icon={faHeart} />
                            )}
                        </button>
                    </div>
                )}
                {!isPlaying ? (
                    <button className='playlistButton' id="play" onClick={() => handlePlayPause(true)}>
                        <FontAwesomeIcon icon={faPlay} />
                    </button>
                ) :
                    (
                        <button className='playlistButton' id="play" onClick={() => handlePlayPause(false)}>
                            <FontAwesomeIcon icon={faPause} />
                        </button>
                    )}
                <button className='playlistButton' id="download-song" onClick={() => {
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
                                default:
                                    break;
                            }
                        })
                }}><FontAwesomeIcon icon={faDownload}
                    />
                </button>
                <audio
                    ref={audioRef}
                    src={song.song_file}
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