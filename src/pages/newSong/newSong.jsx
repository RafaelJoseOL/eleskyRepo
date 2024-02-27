import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAddSong } from "../../hooks/useAddSong"
import { Navigate } from 'react-router-dom';

export const NewSong = ({ listOfTags, isAdmin, defaultTags }) => {
    const { addSong } = useAddSong();
    // const [song, setSong] = useState("");

    const initialValues = {
        name: '',
        origin: '',
        link: '',
        tags: [],
        // audioFile: "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3).max(50).required('Introduce el nombre de la canción.'),
        origin: Yup.string().min(3).max(50).required('Introduce el origen de la canción.'),
        link: Yup.string().min(3).required('Introduce el enlace del archivo.'),
        tags: Yup.array().min(1, 'Selecciona al menos una etiqueta.').of(Yup.string().required()).required(),
        // audioFile: Yup.mixed().required('Selecciona un archivo de audio.'),
    });

    // function handleChange(event) {
    //     console.log(event)
    //     setSong(event.target.files[0]);
    //     console.log(song)
    // }

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        const song_name = values.name;
        const song_origin = values.origin;
        const song_link = values.link;
        const song_tags = values.tags;
        // const song_file = song;
        try {
            addSong({ song_name: song_name, song_origin: song_origin , song_link: song_link, song_tags: song_tags });
            resetForm();
        } catch (error) {
            alert('Error al añadir canción:', error)
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='addSongPage'>
            {isAdmin ? (
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
                        <div className="row justify-content-center mx-auto">
                            <div className='mb-3'>
                                <label htmlFor='inputAddSongOrigin' className='form-label'>
                                    Origen:
                                </label>
                                <Field id='inputAddSongOrigin' name='origin' className='form-control col-8' />
                                <ErrorMessage name='origin' component='p' className='text-danger'></ErrorMessage>
                            </div>
                        </div>
                        <div className="row justify-content-center mx-auto">
                            <div className='mb-3'>
                                <label htmlFor='inputAddSongLink' className='form-label'>
                                    Enlace:
                                </label>
                                <Field id='inputAddSongLink' name='link' className='form-control col-8' />
                                <ErrorMessage name='link' component='p' className='text-danger'></ErrorMessage>
                            </div>
                        </div>
                        <div className='row justify-content-center mx-auto'>
                            <div className='mb-3'>
                                <label className='form-label d-flex justify-content-center'>Etiquetas:</label>
                                <div id='checkbox-group' className='d-flex flex-wrap'>
                                    <div className='mx-auto defaultTags'>
                                        {defaultTags.map((tag, index) => (
                                            <div key={index} className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={tag} className='form-check-input' />
                                                <label className='form-check-label'>{tag}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div id='checkbox-group' className='d-flex justify-content-center flex-wrap mt-3'>
                                    {listOfTags.map((tag, index) => (
                                        <div key={index} className='form-check form-check-inline'>
                                            <Field type='checkbox' name='tags' value={tag} className='form-check-input' />
                                            <label className='form-check-label'>{tag}</label>
                                        </div>
                                    ))}
                                </div>
                                <ErrorMessage name='tags' component='p' className='text-danger'></ErrorMessage>
                            </div>
                            {/* <div className='row justify-content-center mx-auto'>
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
                        </div> */}
                        </div>
                        <div className='row justify-content-center'>
                            <button type='submit' className='btn btn-primary col-6 z-0'>
                                Añadir canción
                            </button>
                        </div>
                    </Form>
                </Formik>
            ) : (
                <Navigate to="/error" />
            )}
        </div >
    )
}

export default NewSong;