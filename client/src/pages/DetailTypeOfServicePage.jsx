import toast from 'react-hot-toast';
import NewServiceFormComponent from '../components/NewServiceFormComponent';
import { FaStar } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { VITE_API_URL } from '../../env.local.js';
import { useState, useEffect } from 'react';
import { fetchTypeOfServiceServices } from '../services/typeOfServiceServices';

const DetailTypeOfServicePage = () => {
    const { typeOfServiceId } = useParams();

    const [data, setData] = useState([]);

    useEffect(() => {
        const getTypeOfService = async () => {
            try {
                const data = await fetchTypeOfServiceServices(typeOfServiceId);
                setData(data);
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
        };

        getTypeOfService();
    }, [typeOfServiceId]);

    return (
        <section className='flex-1024'>
            <form>
                <h3 className='mb-4'>
                    {data.type} en {data.city}
                </h3>
                <fieldset>
                    <img
                        className='w-full h-full object-cover'
                        src={`${VITE_API_URL}/${data.image}`}
                        alt={`${data.description}`}
                    />
                    <p>{data.description}</p>
                    <div className='flex justify-center mb-2'>
                        {[...Array(5)].map((_, index) => (
                            <FaStar
                                key={index}
                                size={30}
                                color={
                                    index + 1 <= Math.ceil(data.averageRating)
                                        ? '#ffc107'
                                        : '#e4e5e9'
                                }
                            />
                        ))}
                    </div>
                    <p>{data.price} €</p>
                </fieldset>
            </form>
            <NewServiceFormComponent
                typeOfServiceId={data.id}
                price={data.price}
            />
        </section>
    );
};

export default DetailTypeOfServicePage;
