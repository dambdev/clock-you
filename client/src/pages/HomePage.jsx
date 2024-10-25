import { NavLink } from 'react-router-dom';
import ContactFormComponent from '../components/ContactFormComponent.jsx';

const { VITE_APP_TITLE } = import.meta.env;

const HomePage = () => {
    return (
        <>
            <section className='hero-css initial-content bgr-img'>
                <h1 className='pt-12 pb-4'>{`Bienvenido a ${VITE_APP_TITLE}`}</h1>
                <h2>
                    Encuentra cualquier servicio que necesites, con la comodidad
                    de no moverte
                </h2>
            </section>
            <section className='hero-css-2 py-6'>
                <div>
                    <h2>¿Cómo funciona?</h2>
                    <div className='articles-container'>
                        <article className='mt-6'>
                            <img
                                src='./step-1-pShop.webp'
                                alt='Ver servicios'
                            />
                            <h3>Busca lo que necesitas</h3>
                            <p className='text-center'>
                                Tenemos casi de todo: limpieza a domicilio,
                                clases particulares, cuidado de mascotas...
                            </p>
                        </article>
                        <article className='mt-6 text-center'>
                            <NavLink
                                className='primary-button'
                                to={'/typeOfServices'}
                            >
                                Buscar
                            </NavLink>
                        </article>
                        <article className='mt-6'>
                            <img src='./step-2.webp' alt='Empleados' />
                            <h3>El profesional ideal</h3>
                            <p className='text-center'>
                                De nuestra amplia variedad, seleccionaremos al
                                más adecuado en base a tu solicitud
                            </p>
                        </article>
                    </div>
                </div>
            </section>
            <section className='hero-css-3'>
                <ContactFormComponent />
            </section>
        </>
    );
};

export default HomePage;
