import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { VITE_NODE_ENV } from '../../env.local';
import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(
        Cookies.get('authToken') || null
    );

    const authLogin = (newToken) => {
        Cookies.set('authToken', newToken, {
            expires: 1,
            httpOnly: true,
            secure: VITE_NODE_ENV === 'production',
            sameSite: 'strict',
        });

        setAuthToken(newToken);
    };

    const authLogout = () => {
        Cookies.remove('authToken');
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, authLogin, authLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
