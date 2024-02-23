import React from 'react';

export const Test = () => {
  const dropboxLink = 'https://www.dropbox.com/scl/fi/hsonv5liwzvflmolxhr5q/Forza.mp3?rlkey=rv26csqlwbg2pq0a8a6lcksnk&raw=1';

  const downloadFile = async () => {
    try {
      const response = await fetch(dropboxLink);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Forza.mp3';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  };

  return (
    <div>
      <h2>Reproductor de Audio</h2>
      <a href={dropboxLink}>Descargar archivo</a>
      <audio controls>
        <source
          src={"https://www.dropbox.com/scl/fi/hsonv5liwzvflmolxhr5q/Forza.mp3?rlkey=rv26csqlwbg2pq0a8a6lcksnk&raw=1"}
          type="audio/mpeg" />
        Tu navegador no soporta la reproducción de audio.
      </audio>
    </div>
  );
};

export default Test;
