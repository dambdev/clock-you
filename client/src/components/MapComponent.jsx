import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
} from 'react-leaflet';

import { IconLocationComponent } from './IconLocationComponent';

import 'leaflet/dist/leaflet.css';

const MapComponent = ({ location }) => {
    const { currentLocation, startLocation, exitLocation } = location;

    const mapCenter = currentLocation || startLocation || exitLocation;

    const positions = [];
    if (currentLocation) positions.push(currentLocation);
    if (startLocation) positions.push(startLocation);
    if (exitLocation) positions.push(exitLocation);

    return (
        <MapContainer center={mapCenter} zoom={16} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {currentLocation && (
                <Marker position={currentLocation} icon={IconLocationComponent}>
                    <Popup>Posición Actual</Popup>
                </Marker>
            )}
            {startLocation && (
                <Marker position={startLocation} icon={IconLocationComponent}>
                    <Popup>Registro de Entrada</Popup>
                </Marker>
            )}
            {exitLocation && (
                <Marker position={exitLocation} icon={IconLocationComponent}>
                    <Popup>Registro de Salida</Popup>
                </Marker>
            )}
            <Polyline positions={positions} color='blue' />
        </MapContainer>
    );
};

export default MapComponent;
