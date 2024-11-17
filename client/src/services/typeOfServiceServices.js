const { VITE_API_URL } = import.meta.env;

export const fetchTypeOfServiceServices = async (typeOfServiceId) => {
    const res = await fetch(
        `${VITE_API_URL}/typeOfServices/${typeOfServiceId}`
    );
    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.data;
};

export const fetchAllTypeOfServicesServices = async (searchParamsToString) => {
    const res = await fetch(
        `${VITE_API_URL}/typeOfServices/?${searchParamsToString}`
    );
    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.data;
};

export const fetchEditTypeOfServiceServices = async (
    typeOfServiceId,
    description,
    price
) => {
    const res = await fetch(
        `${VITE_API_URL}/typeOfServices/${typeOfServiceId}`,
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description,
                price,
            }),
        }
    );

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchDeleteTypeOfServiceServices = async (typeOfServiceId) => {
    const res = await fetch(
        `${VITE_API_URL}/typeOfServices/${typeOfServiceId}`,
        {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchNewTypeOfServiceServices = async (
    type,
    description,
    city,
    price,
    image
) => {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('city', city);
    formData.append('image', image);

    const res = await fetch(`${VITE_API_URL}/typeOfServices`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchEditImageTypeOfServicesService = async (
    image,
    typeOfServiceId
) => {
    const formData = new FormData();
    formData.append('image', image);

    const res = await fetch(
        `${VITE_API_URL}/typeOfServices/${typeOfServiceId}`,
        {
            method: 'PATCH',
            credentials: 'include',
            body: formData,
        }
    );

    const body = await res.json();

    if (body.status !== 'ok') {
        throw new Error(body.message);
    }

    return body.message;
};
