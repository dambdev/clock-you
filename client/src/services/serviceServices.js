const { VITE_API_URL } = import.meta.env;

export const fetchNewServiceServices = async (
    authToken,
    typeOfServiceId,
    dateTime,
    hours,
    address,
    postCode,
    city,
    comments
) => {
    const res = await fetch(`${VITE_API_URL}/services/${typeOfServiceId}`, {
        method: 'POST',
        headers: {
            Authorization: authToken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dateTime,
            hours,
            address,
            postCode,
            city,
            comments,
        }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body;
};

export const fetchAllServicesServices = async (
    searchParamsToString,
    authToken
) => {
    const res = await fetch(
        `${VITE_API_URL}/services/?${searchParamsToString}`,
        {
            headers: { Authorization: authToken },
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

export const fetchDetailServiceServices = async (serviceId, authToken) => {
    const res = await fetch(`${VITE_API_URL}/services/${serviceId}`, {
        headers: {
            Authorization: authToken,
        },
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.data;
};

export const fetchClientAllServicesServices = async (
    searchParamsToString,
    authToken
) => {
    const res = await fetch(
        `${VITE_API_URL}/services/client/?${searchParamsToString}`,
        {
            headers: {
                Authorization: authToken,
            },
        }
    );
    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.data;
};

export const fetchEmployeeAllServicesServices = async (authToken) => {
    const res = await fetch(`${VITE_API_URL}/services/employee`, {
        headers: {
            Authorization: authToken,
        },
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.data;
};

export const fetchEditServiceServices = async (
    serviceId,
    comments,
    address,
    hours,
    city,
    dateTime,
    postCode,
    authToken
) => {
    const res = await fetch(`${VITE_API_URL}/services/${serviceId}`, {
        method: 'PUT',
        headers: {
            Authorization: authToken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            comments,
            address,
            hours,
            city,
            dateTime,
            postCode,
        }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body;
};

export const fetchRatingServiceServices = async (
    serviceId,
    rating,
    authToken
) => {
    const res = await fetch(`${VITE_API_URL}/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
            Authorization: authToken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body;
};
