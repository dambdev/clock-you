const { VITE_API_URL } = import.meta.env;

export const fetchNewShiftRecordServices = async (employeeId, serviceId) => {
    const res = await fetch(`${VITE_API_URL}/shiftRecords/${serviceId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            employeeId,
        }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchAllShiftRecordsServices = async (searchParamsToString) => {
    const res = await fetch(
        `${VITE_API_URL}/shiftrecords/?${searchParamsToString}`,
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

export const fetchClockInShiftRecordServices = async (
    clockIn,
    location,
    shiftRecordId
) => {
    const res = await fetch(`${VITE_API_URL}/shiftrecords`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            shiftRecordId,
            location,
            clockIn,
        }),
    });
    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchClockOutShiftRecordServices = async (
    clockOut,
    location,
    shiftRecordId
) => {
    const res = await fetch(`${VITE_API_URL}/shiftrecords`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            shiftRecordId,
            location,
            clockOut,
        }),
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchDetailShiftRecordServices = async (shiftRecordId) => {
    const res = await fetch(`${VITE_API_URL}/shiftrecords/${shiftRecordId}`, {
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

export const fetchEditShiftRecordServices = async (
    shiftRecordId,
    clockIn,
    clockOut
) => {
    const res = await fetch(
        `${VITE_API_URL}/shiftrecords/edit/${shiftRecordId}`,
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clockIn,
                clockOut,
            }),
        }
    );

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};

export const fetchDeleteShiftRecordServices = async (shiftRecordId) => {
    const res = await fetch(`${VITE_API_URL}/shiftrecords/${shiftRecordId}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    const body = await res.json();

    if (body.status === 'error') {
        throw new Error(body.message);
    }

    return body.message;
};
