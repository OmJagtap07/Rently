import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Building2, Plus, Edit2, Archive, Copy, Share2, MapPin, Users, Home, CheckCircle2, MoreVertical } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';

const PROPERTY_TYPES = ['Apartment', 'Building', 'Villa', 'Commercial', 'PG'];

const Properties = () => {
  const { user } = useOutletContext();
  const { properties, loadingProperties, createProperty, updateProperty, archiveProperty, isOperating } = useProperties(user);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', address: '', propertyType: 'Apartment' });
  const [copiedCode, setCopiedCode] = useState(null);

  const handleOpenModal = (property = null) => {
    if (property) {
      setEditingProperty(property);
      setFormData({
        name: property.name,
        address: property.address,
        propertyType: property.propertyType || 'Apartment'
      });
    } else {
      setEditingProperty(null);
      setFormData({ name: '', address: '', propertyType: 'Apartment' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProperty) {
        await updateProperty(editingProperty.id, formData);
      } else {
        await createProperty(formData);
      }
      handleCloseModal();
    } catch (error) {
      // Error is handled in hook, but we catch it here to stop modal close if needed
    }
  };

  const handleArchive = async (property) => {
    if (window.confirm(`Are you sure you want to archive "${property.name}"? It will be hidden from normal views.`)) {
      await archiveProperty(property.id);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShareCode = async (property) => {
    const shareData = {
      title: `Join ${property.name} on RentManager`,
      text: `Your landlord has invited you to join ${property.name}. Use join code: ${property.joinCode}`,
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopyCode(property.joinCode);
      alert("Join code copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-indigo-400" />
            My Properties
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage your properties, buildings, and join codes</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus className="h-5 w-5" />
          Add Property
        </button>
      </div>

      {loadingProperties ? (
        <div className="text-slate-400 flex justify-center py-12">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center backdrop-blur-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-2xl mb-4">
            <Building2 className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Properties Yet</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            Get started by adding your first property. You'll be able to generate join codes and manage tenants.
          </p>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="h-5 w-5" />
            Add Your First Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl hover:border-slate-700 transition-all flex flex-col h-full group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-lg font-bold text-white truncate">{property.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{property.address}</span>
                  </div>
                </div>
                <div className="relative dropdown">
                  {/* Dropdown menu structure */}
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(property)} className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors" title="Edit Property">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleArchive(property)} className="p-2 text-slate-400 hover:text-red-400 bg-slate-800/50 hover:bg-red-500/10 rounded-lg transition-colors" title="Archive Property">
                      <Archive className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
                    <Home className="h-3 w-3" />
                    Type
                  </div>
                  <div className="text-white font-medium text-sm">{property.propertyType || 'Apartment'}</div>
                </div>
                <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
                    <Users className="h-3 w-3" />
                    Tenants
                  </div>
                  <div className="text-white font-medium text-sm">{property.totalTenants || 0}</div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                  <div className="text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2 text-center">Tenant Join Code</div>
                  <div className="flex items-center justify-between bg-slate-950 rounded-lg p-2 border border-slate-800">
                    <code className="text-lg font-mono font-bold text-white px-2 tracking-widest">{property.joinCode}</code>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleCopyCode(property.joinCode)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                        title="Copy Code"
                      >
                        {copiedCode === property.joinCode ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button 
                        onClick={() => handleShareCode(property)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                        title="Share Code"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Property Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g. Green Valley Residency"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Address</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors min-h-[80px] resize-none"
                  placeholder="e.g. 123 Main St, City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Property Type</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                >
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4 mt-6 border-t border-slate-800/50">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOperating}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-500/20"
                >
                  {isOperating ? 'Saving...' : (editingProperty ? 'Save Changes' : 'Create Property')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
