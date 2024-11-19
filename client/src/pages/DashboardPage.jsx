import useUser from '../hooks/useUser';
import ChatComponent from '../components/ChatComponent';
import UsersComponent from '../components/AdminDashboard/Users/UsersComponent';
import OrdersComponent from '../components/ClientDashboard/OrdersComponent';
import ShiftsComponent from '../components/AdminDashboard/Shifts/ShiftsComponent';
import AvatarComponent from '../components/AvatarComponent';
import ProfileComponent from '../components/ProfileComponent';
import ServicesComponent from '../components/AdminDashboard/Services/ServicesComponent';
import ContractsComponent from '../components/AdminDashboard/Contracts/ContractsComponent';
import MyServicesComponent from '../components/EmployeeDashBoard/MyServicesComponent';
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const DashboardPage = () => {
    const location = useLocation();

    const { user } = useUser();

    const [activeSection, setActiveSection] = useState('profile');

    useEffect(() => {
        if (location.hash) {
            setActiveSection(location.hash.substring(1));
        }
    }, [location]);

    const sectionComponents = {
        profile: <ProfileComponent user={user} />,
        chat: user?.role !== 'client' && <ChatComponent user={user} />,
        users: user?.role === 'admin' && <UsersComponent />,
        services: user?.role === 'admin' && <ServicesComponent />,
        contracts: user?.role === 'admin' && <ContractsComponent />,
        shifts: user?.role === 'admin' && <ShiftsComponent />,
        orders: user?.role === 'client' && <OrdersComponent />,
        myservices: user?.role === 'employee' && <MyServicesComponent />,
    };

    const renderNavLink = (section, label, extraClass = '') => {
        const isActive = activeSection === section;
        return isActive ? (
            <span className={`disabledLink ${extraClass}`}>{label}</span>
        ) : (
            <NavLink className={extraClass} to={`#${section}`}>
                {label}
            </NavLink>
        );
    };

    if (!user) return null;

    return (
        <>
            <AvatarComponent user={user} />
            <section className='manager-tabs'>
                {renderNavLink(
                    'profile',
                    'Perfil',
                    activeSection === 'profile' && 'activeSelectedLink'
                )}
                {user?.role !== 'client' &&
                    renderNavLink(
                        'chat',
                        'Chat',
                        activeSection === 'chat' && 'activeSelectedLink'
                    )}
                {user?.role === 'admin' && (
                    <>
                        {renderNavLink(
                            'contracts',
                            'Contratos',
                            activeSection === 'contracts' &&
                                'activeSelectedLink'
                        )}
                        {renderNavLink(
                            'services',
                            'Servicios',
                            activeSection === 'services' && 'activeSelectedLink'
                        )}
                        {renderNavLink(
                            'shifts',
                            'Turnos',
                            activeSection === 'shifts' && 'activeSelectedLink'
                        )}
                        {renderNavLink(
                            'users',
                            'Usuarios',
                            activeSection === 'users' && 'activeSelectedLink'
                        )}
                    </>
                )}
                {user?.role === 'client' &&
                    renderNavLink(
                        'orders',
                        'Pedidos',
                        activeSection === 'orders' && 'activeSelectedLink'
                    )}

                {user?.role === 'employee' &&
                    renderNavLink(
                        'myservices',
                        'Servicios',
                        activeSection === 'myservices' && 'activeSelectedLink'
                    )}
            </section>
            {sectionComponents[activeSection]}
        </>
    );
};

export default DashboardPage;
