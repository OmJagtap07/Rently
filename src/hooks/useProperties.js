import { useState } from 'react';
import { usePropertyContext } from '../context/PropertyContext';
import { createProperty, updateProperty, archiveProperty } from '../services/propertyService';

export const useProperties = (user) => {
  const { refreshProperties, properties, loadingProperties, selectedPropertyId, setSelectedProperty } = usePropertyContext();
  const [isOperating, setIsOperating] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateProperty = async (propertyData) => {
    if (!user?.uid) return null;
    setIsOperating(true);
    setError(null);
    try {
      const newProperty = await createProperty(user.uid, propertyData);
      await refreshProperties();
      return newProperty;
    } catch (err) {
      console.error("Failed to create property:", err);
      setError("Failed to create property.");
      throw err;
    } finally {
      setIsOperating(false);
    }
  };

  const handleUpdateProperty = async (propertyId, updates) => {
    setIsOperating(true);
    setError(null);
    try {
      await updateProperty(propertyId, updates);
      await refreshProperties();
    } catch (err) {
      console.error("Failed to update property:", err);
      setError("Failed to update property.");
      throw err;
    } finally {
      setIsOperating(false);
    }
  };

  const handleArchiveProperty = async (propertyId) => {
    setIsOperating(true);
    setError(null);
    try {
      await archiveProperty(propertyId);
      await refreshProperties();
    } catch (err) {
      console.error("Failed to archive property:", err);
      setError("Failed to archive property.");
      throw err;
    } finally {
      setIsOperating(false);
    }
  };

  return {
    properties,
    loadingProperties,
    selectedPropertyId,
    setSelectedProperty,
    createProperty: handleCreateProperty,
    updateProperty: handleUpdateProperty,
    archiveProperty: handleArchiveProperty,
    isOperating,
    error,
    refreshProperties
  };
};
