import './Header.css';
import toast from 'react-hot-toast';
import useUser from '../../../hooks/useUser';
import { AuthContext } from '../../../context/AuthContext';
import { FaUser, FaUserTie } from 'react-icons/fa';
import { useNavigate, NavLink } from 'react-router-dom';
import { fetchLogoutUserServices } from '../../../services/userServices';
import { useState, useEffect, useContext } from 'react';

const Header = () => {
    const navigate = useNavigate();

    const { user } = useUser();

    const { authLogout } = useContext(AuthContext);

    const [menuBurguer, setMenuBurguer] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const userIcon = (() => {
        if (user?.role === 'admin') return <FaUserTie />;
        if (user?.role === 'employee') return <FaUser />;
        return null;
    })();

    function handleBurguer() {
        if (windowWidth < 1023) setMenuBurguer(!menuBurguer);
    }

    useEffect(() => {
        const mainHeader = document.getElementById('mainHeader');
        const mainHeaderHeight = mainHeader.offsetHeight;
        let howMuchScrollY;
        const handleScroll = () => {
            howMuchScrollY = window.scrollY;
            howMuchScrollY > mainHeaderHeight
                ? mainHeader.classList.add('sombreado')
                : mainHeader.classList.remove('sombreado');
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const navDinamica = document.getElementById('navdinamica');
        const checkForShowClass = navDinamica.classList.contains('show');
        const changeBodyStyle = () => {
            checkForShowClass
                ? document.body.classList.add('overflow-hidden')
                : document.body.classList.remove('overflow-hidden');
        };

        if (windowWidth < 1024) changeBodyStyle();

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (windowWidth > 1023) {
                setMenuBurguer(false);
                changeBodyStyle();
            } else {
                changeBodyStyle();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [menuBurguer, windowWidth]);

    const handleLogout = async () => {
        toast.promise(fetchLogoutUserServices(), {
            loading: 'Cerrando sesión...',
            success: (response) => response,
            error: (error) => error.message,
        });

        authLogout();
        navigate('/');
    };

    return (
        <header id='mainHeader'>
            <nav className='container lg:my-2 mx-auto mainnav flex flex-wrap'>
                <NavLink className='flex items-center' to={'/'}>
                    <img className='w-14' src='/logo-test.png' alt='clockYou' />

                    <span className='text-2xl pl-1.5 serif-FONT-regular hidden sm:inline-flex'>
                        ClockYou
                    </span>
                </NavLink>

                <ul
                    id='navdinamica'
                    className={menuBurguer ? 'navdinamica show' : 'navdinamica'}
                >
                    <li className='identifyUserIcon'>{userIcon}</li>
                    <li>
                        <NavLink
                            onClick={handleBurguer}
                            className='linkmainnav'
                            to={'/typeOfServices'}
                        >
                            Servicios
                        </NavLink>
                    </li>
                    {!user ? (
                        <>
                            <li>
                                <NavLink
                                    onClick={handleBurguer}
                                    className='linkmainnav'
                                    to={'/register'}
                                >
                                    Registrarse
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    onClick={handleBurguer}
                                    className='linkmainnav'
                                    to={'/login'}
                                >
                                    Iniciar Sesión
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink
                                    onClick={handleBurguer}
                                    className='linkmainnav'
                                    to={'/user#profile'}
                                >
                                    Mi Cuenta
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    onClick={() => {
                                        handleBurguer();
                                        handleLogout();
                                    }}
                                    className='linkmainnav noBgr'
                                    to={'/'}
                                >
                                    Cerrar Sesión
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
                <div
                    onClick={handleBurguer}
                    className={menuBurguer ? 'menuburguer open' : 'menuburguer'}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </header>
    );
};

export default Header;
