import { useState, useEffect } from 'react';
import { getBuses, createBus, updateBus, deleteBus, getDrivers, getRoutes } from '../../api/api';

const AdminBuses = () => {
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: '',
    capacity: '',
    driverId: '',
    routeId: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [busesRes, driversRes, routesRes] = await Promise.all([
        getBuses(),
        getDrivers(),
        getRoutes(),
      ]);
      setBuses(busesRes.data);
      setDrivers(driversRes.data);
      setRoutes(routesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBus) {
        await updateBus(editingBus.id, formData);
      } else {
        await createBus(formData);
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving bus:', error);
      alert('Failed to save bus. Make sure the driver is not already assigned to another bus.');
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setFormData({
      busNumber: bus.busNumber,
      capacity: bus.capacity,
      driverId: bus.driverId,
      routeId: bus.routeId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bus?')) return;
    try {
      await deleteBus(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting bus:', error);
      alert('Failed to delete bus');
    }
  };

  const resetForm = () => {
    setFormData({ busNumber: '', capacity: '', driverId: '', routeId: '' });
    setEditingBus(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const filteredBuses = buses.filter(bus =>
    bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bus.driver && bus.driver.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (bus.route && bus.route.routeName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Manage Buses</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search buses..." 
            className="input flex-1 sm:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setShowForm(!showForm)} className="btn-primary whitespace-nowrap">
            {showForm ? 'Cancel' : '+ Add Bus'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingBus ? 'Edit' : 'Add'} Bus</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Bus License Number</label>
              <input
                type="text"
                required
                placeholder="TN-01-AB-1234"
                value={formData.busNumber}
                onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                className="input"
              />
              <p className="text-xs text-gray-500 mt-1">Enter vehicle license plate number</p>
            </div>
            <div>
              <label className="label">Capacity</label>
              <input
                type="number"
                required
                placeholder="50"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Driver</label>
              <select
                required
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                className="input"
              >
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} ({driver.idCardNumber})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Route</label>
              <select
                required
                value={formData.routeId}
                onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                className="input"
              >
                <option value="">Select Route</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.routeName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus License Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBuses.map((bus) => (
              <tr key={bus.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{bus.busNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bus.capacity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bus.driver?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bus.route?.routeName}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button onClick={() => handleEdit(bus)} className="text-primary-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(bus.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBuses;
