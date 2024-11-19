import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { fetchProfileUserServices } from '../services/userServices';
import { useContext, useEffect, useState } from 'react';

const useUser = () => {
    const { session } = useContext(AuthContext);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await fetchProfileUserServices();

                setUser(user);
            } catch (err) {
                toast.error(err.message, {
                    id: 'ok',
                });
            }
        };

        if (session) {
            getUser();
        } else {
            setUser(null);
        }
    }, [session]);

    return { user };
};

export default useUser;
