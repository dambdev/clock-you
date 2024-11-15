import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchConfirmServiceServices } from '../services/serviceServices.js';

const ConfirmedServicePage = () => {
    const navigate = useNavigate();

    const { validationCode } = useParams();

    const delayedNavigation = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 750);
    };

    useEffect(() => {
        const confirmService = async () => {
            try {
                const data = await fetchConfirmServiceServices(validationCode);

                toast.success(data, {
                    id: 'ok',
                });

                delayedNavigation('/user#orders');
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
        };

        confirmService();
    }, []);

    return <h3 className='mt-8 text-center'>Confirmando servicio...</h3>;
};

export default ConfirmedServicePage;
