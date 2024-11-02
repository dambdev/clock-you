import ListUserComponent from './ListUserComponent';
import RegisterAdminUserComponent from './RegisterAdminUserComponent';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const UsersComponent = () => {
    const [activeSection, setActiveSection] = useState('ListUserComponent');

    const sectionComponents = {
        ListUserComponent: <ListUserComponent />,
        RegisterAdminUserComponent: <RegisterAdminUserComponent />,
    };

    const handleChange = (section, e) => {
        e.preventDefault();
        setActiveSection(section);
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
