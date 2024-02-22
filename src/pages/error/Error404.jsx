import React from 'react';

export const Error404 = () => {
  return (
    <div className='position-relative d-flex flex-column align-items-center mt-5'>
      <div className="text-center fs-4 fw-bold mb-4">
        Página no encontrada.
      </div>
      <img
        src="https://media1.tenor.com/m/sq0ZB8ViJYkAAAAd/elesky-elesky25.gif"
        alt="GIF Cagaste"
        className="img-fluid"
      />
    </div>
  );
}

export default Error404;
