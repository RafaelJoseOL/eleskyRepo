import { useState, useEffect } from 'react';
import { SongCard } from '../../components/songcard'

export const Home = ({ listOfSongs }) => {
    const [search, setSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    const filteredSongs = listOfSongs.filter((song) => {
        const matchesSearch = song.song_name.toLowerCase().includes(search.toLowerCase());
        const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => song.song_tags.includes(tag));
        return matchesSearch && matchesTags;
    });

    return (
        <div className='container-fluid mainHome'>
            <div className='row'>
                <div className='d-none d-md-block col-md-2 sideBar text-light d-flex flex-column justify-content-top ms-3 mt-3'>
                    <div className='searchBar mt-3'>
                        <input
                            type="text"
                            placeholder="Buscar por nombre"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className='mt-2'>
                        <label>Filtrar:</label>
                        <div className='mt-2'>
                            <label>
                                <input type="checkbox" checked={selectedTags.includes('Piano')} onChange={() => toggleTagFilter('Piano')} />
                                <span className='ms-1'>Solo piano</span>
                            </label>
                            <label className='mx-3'>
                                <input type="checkbox" checked={selectedTags.includes('Voz')} onChange={() => toggleTagFilter('Voz')} />
                                <span className='ms-1'>Voz</span>
                            </label>
                            <label className='mx-3'>
                                <input type="checkbox" checked={selectedTags.includes('Concierto')} onChange={() => toggleTagFilter('Concierto')} />
                                <span className='ms-1'>Concierto</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className='d-md-none d-md-block mt-3'>
                    {/* Responsive */}
                </div>
                <div className='col-8 songs mt-3 mx-auto'>
                    <div className='row'>
                        {filteredSongs.map((song, index) => (
                            <div className='song col-12 col-md-10 col-xl-4 mx-auto song mb-4 d-flex flex-column align-items-center justify-content-center' key={index}>
                                <SongCard
                                    song={song}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

    function toggleTagFilter(tag) {
        if (selectedTags.includes(tag)) {
            setSelectedTags([]);
        } else {
            setSelectedTags([tag]);
        }
    }
}

export default Home;