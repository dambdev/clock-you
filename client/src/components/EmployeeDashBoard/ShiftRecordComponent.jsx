import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    fetchClockInShiftRecordServices,
    fetchClockOutShiftRecordServices,
} from '../../services/shiftRecordServices';
import MapComponent from '../MapComponent';
import toast from 'react-hot-toast';

const ShiftRecordComponent = ({ detailData, authToken }) => {
    const navigate = useNavigate();

    const [location, setLocation] = useState({});

    const getLocation = async () => {
        if (!navigator.geolocation) {
            throw new Error('Geolocalización no soportada');
        }
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) =>
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }),
                (error) => {
                    console.error('Error de geolocalización:', error);

                    let mensajeError;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            mensajeError =
                                'Permiso denegado para acceder a la ubicación';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            mensajeError =
                                'La información de la ubicación no está disponible';
                            break;
                        case error.TIMEOUT:
                            mensajeError =
                                'La solicitud de ubicación ha superado el tiempo de espera';
                            break;
                        default:
                            mensajeError =
                                'Error desconocido al acceder a la ubicación';
                            break;
                    }

                    reject(new Error(mensajeError));
                    toast.error(mensajeError, { id: 'error' });
                }
            );
        });
    };

    useEffect(() => {
        const fetchInitialLocation = async () => {
            try {
                const initialLocation = await getLocation();
                setLocation({ currentLocation: initialLocation });
            } catch (error) {
                console.error(
                    'Error al obtener la ubicación inicial:',
                    error.message
                );
            }
        };

        fetchInitialLocation();
    }, []);

    const getStart = async (e) => {
        e.preventDefault();
        const clockIn = new Date();
        try {
            const location = await getLocation();
            setLocation({ currentLocation: location });
            const data = await fetchClockInShiftRecordServices(
                authToken,
                clockIn,
                location,
                detailData.shiftRecordId
            );

            toast.success(data.message, {
                id: 'ok',
            });

            navigate('/user#MyServicesComponent');
        } catch (error) {
            toast.error(error.message, {
                id: 'error',
            });
        }
    };

    const getEnd = async (e) => {
        e.preventDefault();
        const clockOut = new Date();
        try {
            const location = await getLocation();
            setLocation({ currentLocation: location });
            const data = await fetchClockOutShiftRecordServices(
                authToken,
                clockOut,
                location,
                detailData.shiftRecordId
            );

            toast.success(data.message, {
                id: 'ok',
            });

            navigate('/user#MyServicesComponent');
        } catch (error) {
            toast.error(error.message, {
                id: 'error',
            });
        }
    };

    return (
        <form className='mx-auto'>
            <fieldset>
                <button
                    className='mt-4 mb-2 text-white bg-green-600'
                    onClick={getStart}
                >
                    Registrar Entrada
                </button>
                {location.currentLocation &&
                location.currentLocation.lat !== null &&
                location.currentLocation.lng !== null ? (
                    <MapComponent location={location} />
                ) : (
                    <p>Cargando mapa...</p>
                )}
                <button className='mt-2 text-white bg-red-600' onClick={getEnd}>
                    Registrar Salida
                </button>
            </fieldset>
        </form>
    );
};

export default ShiftRecordComponent;
