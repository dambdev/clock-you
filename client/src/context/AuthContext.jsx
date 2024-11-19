import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(
        Cookies.get('authToken') || null
    );
    const [refreshToken, setRefreshToken] = useState(
        Cookies.get('refreshToken') || null
    );

    const authLogout = () => {
        setAuthToken(null);
        setRefreshToken(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, refreshToken, authLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
