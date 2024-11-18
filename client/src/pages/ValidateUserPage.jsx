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
                    return response;
                },
                error: (error) => {
                    return error.message;
                },
            });
        };
        activateUser();
    }, []);

    return <div></div>;
};

export default ValidateUserPage;
