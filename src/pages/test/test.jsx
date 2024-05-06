import React from 'react';
import { useRef } from 'react';

export const Test = () => {
    const audioRef = useRef();
    const link = 'https://dl.dropboxusercontent.com/scl/fi/4om3pi0rjc7onpyyei8ws/ESPECIAL-YOUR-LIE-IN-APRIL.mp3?rlkey=yx7m1pa0bgu9xs3o114ub04o1&st=cydu8va0';
    const link2 = 'https://1drv.ms/u/c/9f074df95686040a/EUNxn_slfrpLnca7zepPQX4BLKD18Z6UxsWuZUY5HLKd2Q';

    const handlePlay = () => {
        audioRef.current.play();
    };

    return (
        <div className='position-relative d-flex flex-column align-items-center mt-5'>
            <button onClick={handlePlay}>
                Play
            </button>
            <button onClick={() => { window.open(link, "_blank") }}>
                Download
            </button>
            <audio
                ref={audioRef}
                src={link2}
                type="audio/mpeg"
            />
        </div>
    );
}

export default Test;