import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import { VITE_START_TIME, VITE_END_TIME } from '../../env.local.js';

const CalendarComponent = ({ events, onSelectEvent, defaultView }) => {
    const localizer = dayjsLocalizer(dayjs);
    dayjs.locale('es');
    const eventStyle = (event) => {
        let backgroundColor = '';
        switch (event.status) {
            case 'accepted':
                backgroundColor = 'orange';
                break;
            case 'canceled':
                backgroundColor = 'red';
                break;
            case 'completed':
                backgroundColor = 'green';
                break;
            case 'confirmed':
                backgroundColor = 'lightgreen';
                break;
            case 'pending':
                backgroundColor = 'lightsalmon';
                break;
            case 'rejected':
                backgroundColor = 'lightcoral';
                break;
            default:
                backgroundColor = 'white';
        }
        return {
            style: {
                backgroundColor,
            },
        };
    };

    const dayStyle = (date) => {
        const day = date.getDay();
        let backgroundColor = '';

        if (day === 0) {
            backgroundColor = 'lightcoral';
        } else if (day === 6) {
            backgroundColor = 'lightgray';
        } else {
            backgroundColor = 'white';
        }

        return {
            style: {
                backgroundColor,
            },
        };
    };

    return (
        <div className='calendar'>
            <Calendar
                formats={{
                    dayHeaderFormat: (date) => {
                        return dayjs(date).format('DD/MM/YYYY');
                    },
                    eventTimeRangeFormat: () => '',
                }}
                messages={{
                    next: '+',
                    previous: '-',
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día',
                }}
                localizer={localizer}
                events={events}
                views={['month', 'week', 'day']}
                onSelectEvent={onSelectEvent}
                eventPropGetter={eventStyle}
                dayPropGetter={dayStyle}
                defaultView={defaultView}
                min={new Date(1970, 1, 1, VITE_START_TIME, 0, 0)}
                max={new Date(1970, 1, 1, VITE_END_TIME, 0, 0)}
            />
        </div>
    );
};

export default CalendarComponent;

CalendarComponent.propTypes = {
    events: PropTypes.array.isRequired,
    onSelectEvent: PropTypes.func.isRequired,
    defaultView: PropTypes.string.isRequired,
};
