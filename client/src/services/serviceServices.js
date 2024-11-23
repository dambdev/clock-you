const { VITE_API_URL } = import.meta.env;

export const fetchNewServiceServices = async ({
    typeOfServiceId,
    startDateTime,
    endDateTime,
    numberOfPeople,
    hours,
    address,
    postCode,
    city,
    comments,
    totalPrice,
}) => {
    const res = await fetch(`${VITE_API_URL}/services/${typeOfServiceId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            startDateTime,
            endDateTime,
            numberOfPeople,
            hours,
            address,
            postCode,
            city,
            comments,
            totalPrice,
        }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchAllServicesServices = async (searchParamsToString) => {
    const res = await fetch(
        `${VITE_API_URL}/services/?${searchParamsToString}`,
        {
            credentials: 'include',
        }
    );

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body;
};

export const fetchConfirmServiceServices = async (validationCode) => {
    const res = await fetch(
        `${VITE_API_URL}/services/validate/${validationCode}`
    );

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchDetailServiceServices = async (serviceId) => {
    const res = await fetch(`${VITE_API_URL}/services/${serviceId}`, {
        credentials: 'include',
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.data;
};

export const fetchClientAllServicesServices = async (searchParamsToString) => {
    const res = await fetch(
        `${VITE_API_URL}/services/client/?${searchParamsToString}`,
        {
            credentials: 'include',
        }
    );

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.data;
};

export const fetchEmployeeAllServicesServices = async (
    searchParamsToString
) => {
    const res = await fetch(
        `${VITE_API_URL}/services/employee?${searchParamsToString}`,
        {
            credentials: 'include',
        }
    );

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.data;
};

export const fetchEditServiceServices = async ({
    serviceId,
    comments,
    address,
    hours,
    city,
    startDateTime,
    endDateTime,
    totalPrice,
    postCode,
    numberOfPeople,
}) => {
    const res = await fetch(`${VITE_API_URL}/services/${serviceId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            comments,
            address,
            hours,
            city,
            startDateTime,
            endDateTime,
            totalPrice,
            postCode,
            numberOfPeople,
        }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchRatingServiceServices = async (serviceId, rating) => {
    const res = await fetch(`${VITE_API_URL}/services/${serviceId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchDeleteServiceService = async (serviceId) => {
    const res = await fetch(`${VITE_API_URL}/services/${serviceId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};
