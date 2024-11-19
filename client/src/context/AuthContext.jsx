import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(localStorage.getItem('session') || null);

    const authLogin = (token) => {
        setSession(token);
        localStorage.setItem('session', token);
    };

    const authLogout = () => {
        setSession(null);
        localStorage.removeItem('session');
    };

    return (
        <AuthContext.Provider value={{ session, authLogin, authLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
