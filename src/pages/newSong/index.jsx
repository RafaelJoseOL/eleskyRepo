import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAddSong } from "../../hooks/useAddSong"
import { useState, useEffect } from 'react';

export const NewSong = ({ authState }) => {
    // const [availableTags, setAvailableTags] = useState([]);
    const { addSong } = useAddSong();
    const [song, setSong] = useState(""); 

    // useEffect(() => {
    //     const fetchTags = async () => {
    //         try {
    //             const q = query(collection(db, "tags"));
    //             const querySnapshot = await getDocs(q);
    //             const tagsData = querySnapshot.docs.map((doc) => doc.data().tag_name);
    //             setAvailableTags(tagsData);
    //             console.log(tagsData);
    //         } catch (error) {
    //             console.error('Error al obtener las etiquetas:', error);
    //         }
    //     };

    //     fetchTags();
    // }, []);

    const initialValues = {
        name: '',
        tags: [],
        audioFile: "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3).max(50).required('Introduce el nombre de la canción.'),
        tags: Yup.array().min(1, 'Selecciona al menos una etiqueta.').of(Yup.string().required()).required(),
        // audioFile: Yup.mixed().required('Selecciona un archivo de audio.'),
    });

    function handleChange(event) {
        console.log(event)
        setSong(event.target.files[0]);
        console.log(song)
    }

    const onSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        const song_name = values.name;
        const song_tags = values.tags;
        const song_file = song;
        try {
            addSong({ song_name: song_name, song_tags: song_tags, song_file: song_file });
            alert("Canción añadida");
        } catch (error) {
            console.error('Error al añadir canción:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='addSongPage'>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className='form-container addSongForm mt-5 mx-auto col-10 col-md-3'>
                    <div className="row justify-content-center mx-auto">
                        <div className='mb-3'>
                            <label htmlFor='inputAddSongName' className='form-label'>
                                Nombre:
                            </label>
                            <Field id='inputAddSongName' name='name' className='form-control col-8' />
                            <ErrorMessage name='name' component='p' className='text-danger'></ErrorMessage>
                        </div>
                    </div>
                    <div className='row justify-content-center mx-auto'>
                        <div className='mb-3'>
                            <label className='form-label d-flex justify-content-center'>Etiquetas:</label>
                            <div id='checkbox-group' className='d-flex flex-wrap'>
                                <div className='mx-auto defaultTags'>
                                    <div className='form-check form-check-inline'>
                                        <Field type='checkbox' name='tags' value={"Voz"} className='form-check-input' />
                                        <label className='form-check-label'>{"Voz"}</label>
                                    </div>
                                    <div className='form-check form-check-inline'>
                                        <Field type='checkbox' name='tags' value={"Piano"} className='form-check-input' />
                                        <label className='form-check-label'>{"Piano"}</label>
                                    </div>
                                </div>
                            </div>
                            {/* <div id='checkbox-group' className='d-flex flex-wrap mt-3'>
                                {availableTags.sort((a, b) => a.localeCompare(b)).map((tag, index) => (
                                    <div key={index} className='form-check form-check-inline'>
                                        <Field type='checkbox' name='tags' value={tag} className='form-check-input' />
                                        <label className='form-check-label'>{tag}</label>
                                    </div>
                                ))}
                            </div> */}
                            <ErrorMessage name='tags' component='p' className='text-danger'></ErrorMessage>
                        </div>
                        <div className='row justify-content-center mx-auto'>
                            <div className='mb-3'>
                                <label htmlFor='inputAudioFile' className='form-label'>
                                    Archivo de audio:
                                </label>
                                <Field  
                                    type='file'                                         
                                    id='inputAudioFile'                                        
                                    name='audioFile'                
                                    onChange={handleChange}
                                    />
                            </div>
                            {/* <ErrorMessage name='file' component='p' className='text-danger'></ErrorMessage> */}
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <button type='submit' className='btn btn-primary col-6'>
                            Añadir canción
                        </button>
                    </div>
                </Form>
            </Formik>
        </div >
    )
}

export default NewSong;