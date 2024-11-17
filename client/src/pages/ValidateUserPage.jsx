import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchActiveUserServices } from '../services/userServices';

const ValidateUserPage = () => {
    const navigate = useNavigate();

    const { registrationCode } = useParams();

    const delayedNavigation = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 750);
    };

    useEffect(() => {
        const activateUser = async () => {
            toast.promise(fetchActiveUserServices(registrationCode), {
                loading: 'Validando usuario...',
                success: (response) => {
                    delayedNavigation('/login');
                    return <b>{response}</b>;
                },
                error: (error) => {
                    return <b>{error.message}</b>;
                },
            });
        };
        activateUser();
    }, []);

    return <div></div>;
};

export default ValidateUserPage;
