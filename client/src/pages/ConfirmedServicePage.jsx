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
            toast.promise(fetchConfirmServiceServices(validationCode), {
                loading: 'Confirmando servicio...',
                success: (response) => {
                    delayedNavigation('/user#orders');
                    return <b>{response}</b>;
                },
                error: (error) => {
                    return <b>{error.message}</b>;
                },
            });
        };

        confirmService();
    }, []);
    return <div></div>;
};

export default ConfirmedServicePage;
