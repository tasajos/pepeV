import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const MapPicker = ({ onLocationSelect }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Obtiene la ubicación actual del usuario al montar el componente
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
        },
        () => {
          // Si hay un error, usa una ubicación por defecto
          setUserLocation({ lat: -17.7833, lng: -63.1822 });
        }
      );
    } else {
      // Si el navegador no soporta geolocalización, usa una ubicación por defecto
      setUserLocation({ lat: -17.7833, lng: -63.1822 });
    }
  }, []);

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newLocation = { lat, lng };
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation);
  }, [onLocationSelect]);

  if (loadError) return <div>Error al cargar el mapa.</div>;
  if (!isLoaded || !userLocation) return <div>Cargando Mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={userLocation}
      onClick={onMapClick}
    >
      {selectedLocation && <Marker position={selectedLocation} />}
    </GoogleMap>
  );
};

export default MapPicker;