import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import {
    fetchClockInShiftRecordServices,
    fetchClockOutShiftRecordServices,
} from '../../services/shiftRecordServices';
import MapComponent from '../MapComponent';

const ShiftRecordComponent = ({ shiftRecordId, clockIn, authToken }) => {
    const navigate = useNavigate();

    const [location, setLocation] = useState({});
    const [loading, setLoading] = useState(false);

    const delayedNavigation = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 750);
    };

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
                    let errorMessage;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage =
                                'Permiso denegado para acceder a la ubicación';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage =
                                'La información de la ubicación no está disponible';
                            break;
                        case error.TIMEOUT:
                            errorMessage =
                                'La solicitud de ubicación ha superado el tiempo de espera';
                            break;
                        default:
                            errorMessage =
                                'Error desconocido al acceder a la ubicación';
                            break;
                    }
                    console.error('Error de geolocalización:', error);
                    toast.error(errorMessage, { id: 'error' });
                    reject(new Error(errorMessage));
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
        setLoading(true);
        const clockIn = new Date();
        try {
            const location = await getLocation();
            setLocation({ currentLocation: location });
            const data = await fetchClockInShiftRecordServices(
                authToken,
                clockIn,
                location,
                shiftRecordId
            );
            toast.success(data.message, { id: 'ok' });
            delayedNavigation('/user#myservices');
        } catch (error) {
            toast.error(error.message, { id: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getEnd = async (e) => {
        e.preventDefault();
        setLoading(true);
        const clockOut = new Date();
        try {
            const location = await getLocation();
            setLocation({ currentLocation: location });
            const data = await fetchClockOutShiftRecordServices(
                authToken,
                clockOut,
                location,
                shiftRecordId
            );
            toast.success(data.message, { id: 'ok' });
            delayedNavigation('/user#myservices');
        } catch (error) {
            toast.error(error.message, { id: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className='mx-auto'>
            <fieldset>
                {!clockIn ? (
                    <button
                        className='mt-4 mb-2 text-white bg-green-600'
                        onClick={getStart}
                        disabled={loading}
                    >
                        Registrar entrada
                    </button>
                ) : (
                    <button
                        className='mt-2 text-white bg-red-600'
                        onClick={getEnd}
                        disabled={loading}
                    >
                        Registrar salida
                    </button>
                )}
                {location.currentLocation &&
                location.currentLocation.lat !== null &&
                location.currentLocation.lng !== null ? (
                    <MapComponent location={location} />
                ) : (
                    <p>Cargando mapa...</p>
                )}
            </fieldset>
        </form>
    );
};

export default ShiftRecordComponent;
