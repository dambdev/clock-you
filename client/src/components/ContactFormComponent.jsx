import toast from 'react-hot-toast';
import { VITE_APP_TITLE, VITE_EMAIL_KEY } from '../../env.local.js';

const ContactFormComponent = () => {
    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        formData.append('access_key', VITE_EMAIL_KEY);

        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: json,
        }).then((res) => res.json());

        if (res.success) {
            toast.success('Consulta enviada correctamente', { id: 'ok' });
            event.target.reset();
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <fieldset>
                <legend>Contacta con {VITE_APP_TITLE}</legend>
                <label htmlFor='name'>Nombre</label>
                <input
                    required
                    type='text'
                    id='name'
                    name='name'
                    placeholder='Escribe aquí tu nombre'
                />
                <label htmlFor='email'>Email</label>
                <input
                    required
                    type='email'
                    id='email'
                    name='email'
                    placeholder='Escribe aquí tu email'
                />
                <label htmlFor='comments'>Cuéntanos</label>
                <textarea
                    required
                    id='comments'
                    name='message'
                    minLength='10'
                    maxLength='500'
                    placeholder='Mensaje...'
                    style={{ height: 'auto' }}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                ></textarea>
                <div className='mx-auto'>
                    <button className='mr-4' type='submit'>
                        Enviar
                    </button>
                    <button type='reset'>Limpiar</button>
                </div>
            </fieldset>
        </form>
    );
};

export default ContactFormComponent;
