import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { VITE_API_URL } from '../../env.local.js';
import { fetchEditAvatarUserServices } from '../services/userServices.js';

const AvatarComponent = ({ user }) => {
    const [avatar, setAvatar] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [enableEditAvatar, setEnableEditAvatar] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleEditAvatar = async (e) => {
        e.preventDefault();
        if (enableEditAvatar) {
            toast.promise(fetchEditAvatarUserServices(user?.id, avatar), {
                loading: 'Cambiando avatar...',
                success: (response) => {
                    return <b>{response}</b>;
                },
                error: (error) => {
                    return <b>{error.message}</b>;
                },
            });
            setAvatar(null);
            setEnableEditAvatar(!enableEditAvatar);
        }
    };

    if (!user) return null;

    return (
        <form onSubmit={handleEditAvatar}>
            <img
                className='user-avatar mx-auto'
                src={
                    previewUrl ||
                    (user?.avatar
                        ? `${VITE_API_URL}/${user.avatar}`
                        : '/default-avatar.png')
                }
                alt='Avatar'
            />
            {enableEditAvatar ? (
                <div className='text-center mt-4'>
                    <label
                        className='input-file text-center mt-2'
                        htmlFor='file'
                    >
                        Selecciona Imágen
                    </label>
                    <input
                        id='file'
                        type='file'
                        accept='image/png, image/jpg, image/jpeg, image/tiff, image/webp'
                        className='hidden'
                        required
                        onChange={handleAvatarChange}
                    />
                </div>
            ) : (
                ''
            )}
            <div className='text-center mt-4'>
                <button type='submit'>
                    {!enableEditAvatar ? 'Cambiar' : 'Guardar'}
                </button>
                <h2 className='mt-4'>Hola {user?.firstName}</h2>
            </div>
        </form>
    );
};

export default AvatarComponent;

AvatarComponent.propTypes = {
    user: PropTypes.object,
};
