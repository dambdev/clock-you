import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/AuthContext.jsx';
import { VITE_API_URL } from '../../env.local.js';
import { useState, useContext } from 'react';
import { fetchEditAvatarUserServices } from '../services/userServices.js';

const AvatarComponent = ({ user }) => {
    const { authToken } = useContext(AuthContext);

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
        try {
            if (enableEditAvatar) {
                const data = await fetchEditAvatarUserServices(
                    user?.id,
                    authToken,
                    avatar
                );
                setAvatar(null);

                toast.success(data.message, {
                    id: 'ok',
                });
            }
            setEnableEditAvatar(!enableEditAvatar);
        } catch (error) {
            toast.error(error.message, {
                id: 'error',
            });
        }
    };

    return (
        <form className='mx-auto' onSubmit={handleEditAvatar}>
            <img
                className='user-avatar mx-auto'
                src={
                    previewUrl ||
                    (user?.avatar
                        ? `${VITE_API_URL}/uploads/${user.avatar}`
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
