import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchActiveUserServices } from '../services/userServices';
import toast from 'react-hot-toast';

const ValidateUserPage = () => {
    const { registrationCode } = useParams();

    const navigate = useNavigate();

    const delayedNavigation = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 750);
    };

    useEffect(() => {
        const activateUser = async () => {
            try {
                const data = await fetchActiveUserServices(registrationCode);

                toast.success(data, {
                    id: 'ok',
                });

                delayedNavigation('/login');
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
        };
        activateUser();
    }, []);

    return <h3 className='mt-8 text-center'>Validando usuario...</h3>;
};

export default ValidateUserPage;
