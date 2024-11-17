import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import MapComponent from '../MapComponent';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
    fetchClockInShiftRecordServices,
    fetchClockOutShiftRecordServices,
} from '../../services/shiftRecordServices';

const ShiftRecordComponent = ({ shiftRecordId, clockIn }) => {
    const navigate = useNavigate();

    const [location, setLocation] = useState({});
    const [loading, setLoading] = useState(false);

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

    const delayedNavigation = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 750);
    };

    const getStart = async (e) => {
        e.preventDefault();
        setLoading(true);
        const startDateTime = new Date();
        const clockIn = startDateTime.toISOString().slice(0, 16);
        const location = await getLocation();
        setLocation({ currentLocation: location });
        toast.promise(
            fetchClockInShiftRecordServices(clockIn, location, shiftRecordId),
            {
                loading: 'Registrando entrada...',
                success: (response) => {
                    return <b>{response}</b>;
                },
                error: (error) => {
                    return <b>{error.message}</b>;
                },
            }
        );
        setLoading(false);
    };

    const getEnd = async (e) => {
        e.preventDefault();
        setLoading(true);
        const exitDateTime = new Date();
        const clockOut = exitDateTime.toISOString().slice(0, 16);
        const location = await getLocation();
        setLocation({ currentLocation: location });
        toast.promise(
            fetchClockOutShiftRecordServices(clockOut, location, shiftRecordId),
            {
                loading: 'Registrando salida...',
                success: (response) => {
                    return <b>{response}</b>;
                },
                error: (error) => {
                    return <b>{error.message}</b>;
                },
            }
        );
        delayedNavigation('/user#myservices');
        setLoading(false);
    };

    if (!shiftRecordId) return null;

    return (
        <form>
            <fieldset className='mb-4'>
                {!clockIn ? (
                    <button
                        className='mt-4 text-white bg-green-600'
                        onClick={getStart}
                        disabled={loading}
                    >
                        Registrar entrada
                    </button>
                ) : (
                    <button
                        className='mt-4 text-white bg-red-600'
                        onClick={getEnd}
                        disabled={loading}
                    >
                        Registrar salida
                    </button>
                )}
            </fieldset>
            {location.currentLocation &&
            location.currentLocation.lat !== null &&
            location.currentLocation.lng !== null ? (
                <MapComponent location={location} />
            ) : (
                <p>Cargando mapa...</p>
            )}
        </form>
    );
};

export default ShiftRecordComponent;

ShiftRecordComponent.propTypes = {
    shiftRecordId: PropTypes.string.isRequired,
    clockIn: PropTypes.string.isRequired,
    authToken: PropTypes.string.isRequired,
};
