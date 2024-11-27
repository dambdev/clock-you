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

    const sectionComponents = {
        profile: <ProfileComponent user={user} />,
        chat: <ChatComponent user={user} />,
        contracts: <ContractsComponent />,
        services: <ServicesComponent />,
        shifts: <ShiftsComponent />,
        users: <UsersComponent />,
        orders: <OrdersComponent />,
        myservices: <MyServicesComponent />,
    };

    const sections = [
        { key: 'profile', label: 'Mis Datos' },
        { key: 'chat', label: 'Chat', role: ['admin', 'employee'] },
        { key: 'contracts', label: 'Contratos', role: 'admin' },
        { key: 'services', label: 'Servicios', role: 'admin' },
        { key: 'shifts', label: 'Turnos', role: 'admin' },
        { key: 'users', label: 'Usuarios', role: 'admin' },
        { key: 'orders', label: 'Pedidos', role: 'client' },
        { key: 'myservices', label: 'Servicios', role: 'employee' },
    ];

    useEffect(() => {
        if (location.hash) {
            setActiveSection(location.hash.substring(1));
        }
    }, [location]);

    const renderNavLink = (section, label) => {
        const isActive = activeSection === section;
        return (
            <NavLink
                to={`#${section}`}
                className={isActive ? 'activeSelectedLink' : ''}
            >
                {label}
            </NavLink>
        );
    };

    if (!user) return null;

    return (
        <>
            <AvatarComponent user={user} />
            <section className='manager-tabs'>
                {sections.map(({ key, label, role }) => {
                    if (
                        !role ||
                        (Array.isArray(role)
                            ? role.includes(user?.role)
                            : user?.role === role)
                    ) {
                        return renderNavLink(key, label);
                    }
                    return null;
                })}
            </section>
            {sectionComponents[activeSection]}
        </>
    );
};

export default DashboardPage;
