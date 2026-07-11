import { useState, useEffect } from 'react';
import { getDrivers, createDriver, updateDriver, deleteDriver } from '../../api/api';
import ImageUploadWidget from '../../components/ImageUploadWidget';

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    idCardNumber: '',
    photoUrl: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await getDrivers();
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        await updateDriver(editingDriver.id, formData);
      } else {
        await createDriver(formData);
      }
      fetchDrivers();
      resetForm();
    } catch (error) {
      console.error('Error saving driver:', error);
      alert('Failed to save driver. Make sure the ID card number is unique.');
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      phoneNumber: driver.phoneNumber,
      idCardNumber: driver.idCardNumber,
      photoUrl: driver.photoUrl || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this driver?')) return;
    try {
      await deleteDriver(id);
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
      alert('Failed to delete driver. Make sure the driver is not assigned to any bus.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', phoneNumber: '', idCardNumber: '', photoUrl: '' });
    setEditingDriver(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.idCardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.phoneNumber.includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Manage Drivers</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search drivers..." 
            className="input flex-1 sm:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setShowForm(!showForm)} className="btn-primary whitespace-nowrap">
            {showForm ? 'Cancel' : '+ Add Driver'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingDriver ? 'Edit' : 'Add'} Driver</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                required
                placeholder="Rajesh Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">ID Card Number</label>
              <input
                type="text"
                required
                placeholder="DRV001"
                value={formData.idCardNumber}
                onChange={(e) => setFormData({ ...formData, idCardNumber: e.target.value })}
                className="input"
              />
            </div>
            <div className="pt-2">
              <ImageUploadWidget
                label="Driver Photo"
                helpText="Upload a profile picture for the driver (optional)."
                currentImage={formData.photoUrl}
                onImageUpload={(url) => setFormData({ ...formData, photoUrl: url })}
              />
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="card">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {driver.photoUrl ? (
                    <img src={driver.photoUrl} alt={driver.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">👨‍✈️</span>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{driver.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{driver.phoneNumber}</p>
                <p className="text-sm text-gray-600">ID: {driver.idCardNumber}</p>
                {driver.buses && driver.buses.length > 0 && (
                  <p className="text-sm text-primary-600 mt-1">Buses: {driver.buses.length}</p>
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
              <button onClick={() => handleEdit(driver)} className="text-sm text-primary-600 hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(driver.id)} className="text-sm text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDrivers;
