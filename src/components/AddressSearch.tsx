// AddressSearch.tsx

import React, { useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

// Inclure la bibliothèque 'places'
const libraries = ['places'];

const AddressSearch: React.FC<{ onSelect: (location: google.maps.LatLng) => void }> = ({ onSelect }) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  
  const handleLoad = (autocomplete: google.maps.places.Autocomplete) => {
    console.log('Autocomplete loaded:', autocomplete);
    setAutocomplete(autocomplete);
  };
  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log('Place changed:', place);
      if (place.geometry && place.geometry.location) {
        onSelect(place.geometry.location);
        setInputValue(place.formatted_address || '');
      }
    }
  };
  
  return (
    <LoadScript 
      googleMapsApiKey="AIzaSyDFUn6EuiuNTZ0TsETQ-BhCpmMcvOA7FME" // Remplacez par votre clé API
      libraries={libraries} // Inclure la bibliothèque 'places'
    >
      <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Rechercher une adresse"
          style={{ width: '100%', padding: '5px' }}
        />
      </Autocomplete>
    </LoadScript>
  );
};

export default AddressSearch;