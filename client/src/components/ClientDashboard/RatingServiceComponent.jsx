import Modal from 'react-modal';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { useState, useContext } from 'react';
import { fetchRatingServiceServices } from '../../services/serviceServices';

const RatingServiceComponent = ({
    serviceId,
    onRequestClose,
    onRatingSuccess,
}) => {
    const { session } = useContext(AuthContext);

    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);

    const handleRatingService = async (e) => {
        e.preventDefault();

        toast.promise(fetchRatingServiceServices(serviceId, rating), {
            loading: 'Valorando...',
            success: (response) => {
                onRequestClose();
                onRatingSuccess();
                return response;
            },
            error: (error) => {
                return error.message;
            },
        });
    };

    return (
        <form onSubmit={handleRatingService}>
            <fieldset>
                <section className='flex justify-center mt-4'>
                    {[...Array(5)].map((_, index) => {
                        const currentRating = index + 1;
                        return (
                            <div key={currentRating}>
                                <input
                                    type='radio'
                                    id={`star${currentRating}`}
                                    name='rating'
                                    value={currentRating}
                                    className='hidden'
                                    onClick={() => setRating(currentRating)}
                                />
                                <label
                                    htmlFor={`star${currentRating}`}
                                    className='cursor-pointer'
                                    onMouseEnter={() => setHover(currentRating)}
                                    onMouseLeave={() => setHover(null)}
                                >
                                    <FaStar
                                        size={50}
                                        color={
                                            currentRating <= (hover || rating)
                                                ? '#ffc107'
                                                : '#e4e5e9'
                                        }
                                    />
                                </label>
                            </div>
                        );
                    })}
                </section>
                <div className='mx-auto'>
                    <button type='submit'>Valorar</button>
                </div>
            </fieldset>
        </form>
    );
};

const RatingModal = ({
    isOpen,
    onRequestClose,
    serviceId,
    onRatingSuccess,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='modal-content'
        >
            <RatingServiceComponent
                serviceId={serviceId}
                onRequestClose={onRequestClose}
                onRatingSuccess={onRatingSuccess}
            />
        </Modal>
    );
};

export default RatingModal;

RatingServiceComponent.propTypes = {
    serviceId: PropTypes.string,
    onRequestClose: PropTypes.func,
    onRatingSuccess: PropTypes.func,
};

RatingModal.propTypes = {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
    serviceId: PropTypes.string,
    onRatingSuccess: PropTypes.func,
};
