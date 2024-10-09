import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ListUserComponent from './ListUserComponent';
import RegisterAdminUserComponent from './RegisterAdminUserComponent';

const UsersComponent = () => {
    const [activeSection, setActiveSection] = useState('ListUserComponent');

    const handleChange = (section, e) => {
        e.preventDefault();
        setActiveSection(section);
    };

    const sectionComponents = {
        ListUserComponent: <ListUserComponent />,
        RegisterAdminUserComponent: <RegisterAdminUserComponent />,
    };

    return (
        <>
            <div className='manager-tabs'>
                <NavLink
                    className={
                        activeSection === 'ListUserComponent' &&
                        'activeSelectedLink'
                    }
                    onClick={(e) => {
                        handleChange('ListUserComponent', e);
                    }}
                >
                    Ver Todos
                </NavLink>
                <NavLink
                    className={
                        activeSection === 'RegisterAdminUserComponent' &&
                        'activeSelectedLink'
                    }
                    onClick={(e) => {
                        handleChange('RegisterAdminUserComponent', e);
                    }}
                >
                    Registrar
                </NavLink>
            </div>
            {sectionComponents[activeSection]}
        </>
    );
};

export default UsersComponent;
