import React from 'react'
import { useRef, useState } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from "../config/firebase-config";

export const SongCardPlaylist = ({ song, nextSong }) => {
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

    const handlePlayPauseClick = () => {
        handlePlayPause(!isPlaying);
        if (!isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    };

    const handlePlayPause = (play) => {
        if (play) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    };

    const handleSongEnded = () => {
        setIsPlaying(false);
        nextSong();
        setTimeout(() => {
            handlePlayPauseClick();
        }, 2000);
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
            <div className="card__wrapper">
                <button className="card__btn card__btn-play mx-auto" onClick={handlePlayPauseClick}>
                    <svg
                        fill={isPlaying ? "#000" : "#fff"}
                        height={22}
                        viewBox="0 0 18 22"
                        width={18}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="m0 0v22l18-11z" />
                    </svg>
                </button>
                <button
                    className='Btn btn-primary col-1 downloadButton mx-auto'
                    onClick={() => {
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
                    }}
                >
                    <svg className="svgIcon" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></svg>
                    <span className="icon2"></span>
                    <span className="tooltip">Download</span>
                </button>
                <audio
                    ref={audioRef}
                    src={song.song_file}
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={() => setCurrentTimeFormat(audioRef.current.currentTime)}
                    onPause={() => handlePlayPause(false)}
                    onEnded={handleSongEnded}
                />
            </div>
        </div>
    )
}

export default SongCardPlaylist;