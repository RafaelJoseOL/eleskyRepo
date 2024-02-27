import React from 'react'

export const Album = ({ isAdmin }) => {
    return (
        <div>
            {isAdmin ? (
                <div className='container-fluid'>
                    <p className='col-12 text-center mt-4'>
                        <button
                            className="filterButton col-2" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapse2024" aria-expanded="false" aria-controls="collapse2024">
                            Eventos 2024
                        </button>
                        <div className="collapse text-align-center text-center mt-3" id="collapse2024">
                            <p className='col-12 text-center'>
                                <button
                                    className="filterButton" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseCandlelight" aria-expanded="false"
                                    aria-controls="collapseCandlelight">
                                    Candlelight
                                </button>
                                <div className="collapse text-align-center text-center mt-3" id="collapseCandlelight">
                                    <img
                                        className='albumPhoto col-2 mx-3'
                                        src='https://www.dropbox.com/scl/fi/p9a760nnmfvcgl4uktkw1/PXL_20240211_224200864.jpg?rlkey=q1327u51kj9v1tz1k9tc7q7kb&raw=1'
                                    />
                                    <img
                                        className='albumPhoto col-2 mx-3'
                                        src='https://www.dropbox.com/scl/fi/q3q3kt4139okuqr5f6qzg/Elesky_4.jpg?rlkey=xcrug7hvn5a66f7wodzyyvwqe&raw=1'
                                    />
                                </div>
                            </p>
                            <p className='col-12 text-center'>
                                <button
                                    className="filterButton" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseOxo" aria-expanded="false"
                                    aria-controls="collapseOxo">
                                    Museo Oxo
                                </button>
                                <div className="collapse text-align-center text-center" id="collapseOxo">
                                    Fotos aquí
                                </div>
                            </p>
                        </div>
                    </p>

                </div>
            ) : (
                <div className='col-12 d-flex text-center justify-content-center mt-5 fw-bold fs-5'>
                    En construcción.
                </div>
            )}
        </div>
    )
}

export default Album