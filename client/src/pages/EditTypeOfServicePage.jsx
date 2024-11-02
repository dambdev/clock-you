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
    const { authToken } = useContext(AuthContext);

    const [data, setData] = useState([]);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [enableEditImage, setEnableEditImage] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const getTypeOfService = async () => {
            try {
                const data = await fetchTypeOfServiceServices(typeOfServiceId);
                setData(data);
                setDescription(data.description);
                setPrice(data.price);
                setImage(data.image);
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
            try {
                const data = await fetchEditImageTypeOfServicesService(
                    image,
                    authToken,
                    typeOfServiceId
                );

                toast.success(data.message, {
                    id: 'ok',
                });

                delayedNavigation('/user#services');
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
            setEnableEditImage(false);
        } else {
            setEnableEditImage(true);
        }
    };

    const handleEditService = async (e) => {
        e.preventDefault();
        try {
            const data = await fetchEditTypeOfServiceServices(
                typeOfServiceId,
                description,
                price,
                authToken
            );
            toast.success(data.message, {
                id: 'ok',
            });
            delayedNavigation('/user#services');
        } catch (error) {
            toast.error(error.message, {
                id: 'error',
            });
        }
    };

    const handleDeleteService = async (e) => {
        e.preventDefault();
        if (
            window.confirm(
                '¿Estás seguro de querer eliminar el servicio?\n¡¡¡Esta acción no se puede deshacer!!!'
            )
        ) {
            try {
                const data = await fetchDeleteTypeOfServiceServices(
                    typeOfServiceId,
                    authToken
                );
                toast.success(data.message, {
                    id: 'ok',
                });
                delayedNavigation('/user#services');
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
        }
    };

    return (
        <>
            <h2 className='mt-4'>
                {data.type} en {data.city}
            </h2>
            <section className='flex-1024'>
                <form
                    className='profile-form mx-auto'
                    onSubmit={handleEditImage}
                >
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
                                    accept='image/png, image/jpg, image/jpeg, image/tiff'
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
                <form
                    className='profile-form mx-auto'
                    onSubmit={handleEditService}
                >
                    <fieldset>
                        <legend>Editar</legend>
                        <label htmlFor='description'>Descripción</label>
                        <input
                            required
                            id='description'
                            type='text'
                            value={description}
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
