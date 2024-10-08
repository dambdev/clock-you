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

    const [location, setLocation] = useState({
        currentLocation: { lat: null, lng: null },
    });
    const [loading, setLoading] = useState(true);

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) =>
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        }),
                    (error) => {
                        console.error('Geolocation error:', error);
                        reject(error);
                    }
                );
            } else {
                reject(new Error('Geolocalización no soportada'));
            }
        });
    };

    useEffect(() => {
        const fetchInitialLocation = async () => {
            try {
                const initialLocation = await getLocation();
                setLocation({ currentLocation: initialLocation });
            } catch (error) {
                console.error('Error fetching initial location:', error);
            } finally {
                setLoading(false);
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
                {!loading &&
                location.currentLocation.lat !== null &&
                location.currentLocation.lng !== null ? (
                    <MapComponent location={location} />
                ) : (
                    <p>Loading map...</p>
                )}
                <button className='mt-2 text-white bg-red-600' onClick={getEnd}>
                    Registrar Salida
                </button>
            </fieldset>
        </form>
    );
};

export default ShiftRecordComponent;
