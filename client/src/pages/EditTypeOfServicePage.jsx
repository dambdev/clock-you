import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { VITE_API_URL } from '../../env.local.js';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import {
    fetchTypeOfServiceServices,
    fetchDeleteTypeOfServiceServices,
    fetchEditTypeOfServiceServices,
    fetchEditImageTypeOfServicesService,
} from '../services/typeOfServiceServices';

const EditTypeOfServicePage = () => {
    const navigate = useNavigate();

    const { typeOfServiceId } = useParams();
    const { session } = useContext(AuthContext);

    const [data, setData] = useState([]);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [enableEditImage, setEnableEditImage] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTypeOfService = async () => {
            try {
                const response = await fetchTypeOfServiceServices(
                    typeOfServiceId
                );
                setData(response);
                setDescription(response.description);
                setPrice(response.price);
                setImage(response.image);
                setLoading(false);
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
        };

        getTypeOfService();
    }, [typeOfServiceId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const delayedNavigation = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 750);
    };

    const handleEditImage = async (e) => {
        e.preventDefault();
        if (enableEditImage) {
            toast.promise(
                fetchEditImageTypeOfServicesService(image, typeOfServiceId),
                {
                    loading: 'Editando Imágen...',
                    success: (response) => {
                        delayedNavigation('/user#services');
                        return response;
                    },
                    error: (error) => {
                        return error.message;
                    },
                }
            );
            setEnableEditImage(false);
        } else {
            setEnableEditImage(true);
        }
    };

    const handleEditService = async (e) => {
        e.preventDefault();
        toast.promise(
            fetchEditTypeOfServiceServices(typeOfServiceId, description, price),
            {
                loading: 'Editando Servicio...',
                success: (response) => {
                    delayedNavigation('/user#services');
                    return response;
                },
                error: (error) => {
                    return error.message;
                },
            }
        );
    };

    const handleDeleteService = async (e) => {
        e.preventDefault();
        if (
            window.confirm(
                '¿Estás seguro de querer eliminar el servicio?\n¡¡¡Esta acción no se puede deshacer!!!'
            )
        ) {
            toast.promise(fetchDeleteTypeOfServiceServices(typeOfServiceId), {
                loading: 'Eliminando Servicio...',
                success: (response) => {
                    delayedNavigation('/user#services');
                    return response;
                },
                error: (error) => {
                    return error.message;
                },
            });
        }
    };

    if (loading) return null;

    return (
        <>
            <h2 className='mt-4'>
                {data.type} en {data.city}
            </h2>
            <section className='flex-1024'>
                <form className='form-1024' onSubmit={handleEditImage}>
                    <fieldset>
                        <img
                            src={
                                previewUrl ||
                                (data?.image ? `${VITE_API_URL}/${image}` : '')
                            }
                            alt={`${data.description}`}
                        />
                        {enableEditImage ? (
                            <>
                                <label
                                    className='input-file text-center mt-2'
                                    htmlFor='file'
                                >
                                    Selecciona Imágen
                                </label>

                                <input
                                    id='file'
                                    type='file'
                                    className='hidden'
                                    accept='image/png, image/jpg, image/jpeg, image/tiff, image/webp'
                                    onChange={handleImageChange}
                                />
                            </>
                        ) : (
                            ''
                        )}
                        <button className='mt-2' type='submit'>
                            {enableEditImage ? 'Guardar' : 'Editar Imágen'}
                        </button>
                    </fieldset>
                </form>
                <form className='form-1024' onSubmit={handleEditService}>
                    <fieldset>
                        <label className='mt-2' htmlFor='description'>
                            Descripción
                        </label>
                        <textarea
                            required
                            id='description'
                            maxLength='500'
                            value={description}
                            style={{ height: 'auto' }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height =
                                    e.target.scrollHeight + 'px';
                            }}
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                        />

                        <label htmlFor='price'>Precio</label>
                        <input
                            required
                            id='price'
                            type='number'
                            min='1'
                            max='100'
                            step='0.01'
                            value={price}
                            onChange={(e) => {
                                setPrice(e.target.value);
                            }}
                        />
                        <div className='mx-auto'>
                            <button type='submit'>Guardar</button>
                            <button
                                className='ml-4 bg-red-500 text-white'
                                type='button'
                                onClick={handleDeleteService}
                            >
                                Eliminar
                            </button>
                        </div>
                    </fieldset>
                </form>
            </section>
        </>
    );
};

export default EditTypeOfServicePage;
