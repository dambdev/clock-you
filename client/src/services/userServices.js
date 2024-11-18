const { VITE_API_URL } = import.meta.env;

export const fetchRegisterUserServices = async (
    email,
    firstName,
    lastName,
    dni,
    phone,
    password
) => {
    const res = await fetch(`${VITE_API_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            firstName,
            lastName,
            dni,
            phone,
            password,
        }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchRegisterAdminUserServices = async (
    email,
    firstName,
    lastName,
    dni,
    phone,
    job,
    city,
    role
) => {
    const res = await fetch(`${VITE_API_URL}/users/admin/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            firstName,
            lastName,
            dni,
            phone,
            job,
            city,
            role,
        }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchActiveUserServices = async (registrationCode) => {
    const res = await fetch(
        `${VITE_API_URL}/users/validate/${registrationCode}`
    );

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchLoginUserServices = async (email, password) => {
    const res = await fetch(`${VITE_API_URL}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body;
};

export const fetchProfileUserServices = async () => {
    const res = await fetch(`${VITE_API_URL}/user`, {
        credentials: 'include',
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.data;
};

export const fetchSendRecoverPasswordUserServices = async (email) => {
    const res = await fetch(`${VITE_API_URL}/users/password/recover`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
        }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchChangePasswordUserServices = async (
    recoverPasswordCode,
    newPassword
) => {
    const res = await fetch(`${VITE_API_URL}/users/password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            recoverPasswordCode,
            newPassword,
        }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchEditUserServices = async (
    firstName,
    lastName,
    phone,
    userId
) => {
    const res = await fetch(`${VITE_API_URL}/user/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName,
            lastName,
            phone,
        }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body;
};

export const fetchEditPasswordUserServices = async (
    actualPassword,
    newPassword,
    userId
) => {
    const res = await fetch(`${VITE_API_URL}/user/password/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            actualPassword,
            newPassword,
        }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }
    return body.message;
};

export const fetchDeleteUserServices = async (userId) => {
    const res = await fetch(`${VITE_API_URL}/user/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }
    return body.message;
};

export const fetchEditAvatarUserServices = async (userId, avatar) => {
    const formData = new FormData();
    formData.append('avatar', avatar);

    const res = await fetch(`${VITE_API_URL}/user/avatar/${userId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchAllUsersServices = async (searchParamsToString) => {
    const res = await fetch(`${VITE_API_URL}/users/?${searchParamsToString}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }
    return body.data;
};
