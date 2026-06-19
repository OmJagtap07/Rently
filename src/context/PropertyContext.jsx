import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProperties } from '../services/propertyService';

export const PropertyContext = createContext();

export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
};

export const PropertyProvider = ({ user, children }) => {
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(() => {
    return localStorage.getItem('selectedPropertyId') || null;
  });
  const [loadingProperties, setLoadingProperties] = useState(true);

  const refreshProperties = async () => {
    if (!user?.uid) {
      setLoadingProperties(false);
      return;
    }
    
    try {
      setLoadingProperties(true);
      const data = await getProperties(user.uid);
      setProperties(data);
      
      // Auto-select logic
      if (data.length === 1) {
        setSelectedPropertyId(data[0].id);
        localStorage.setItem('selectedPropertyId', data[0].id);
      } else if (data.length > 0 && selectedPropertyId) {
        // verify selectedPropertyId still exists in the fetched properties
        const exists = data.find(p => p.id === selectedPropertyId);
        if (!exists) {
          setSelectedPropertyId(null);
          localStorage.removeItem('selectedPropertyId');
        }
      }
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setLoadingProperties(false);
    }
  };

  useEffect(() => {
    refreshProperties();
  }, [user]);

  const handleSetSelectedProperty = (id) => {
    setSelectedPropertyId(id);
    if (id) {
      localStorage.setItem('selectedPropertyId', id);
    } else {
      localStorage.removeItem('selectedPropertyId');
    }
  };

  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || null;

  const value = {
    properties,
    selectedProperty,
    selectedPropertyId,
    setSelectedProperty: handleSetSelectedProperty,
    refreshProperties,
    loadingProperties
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};
