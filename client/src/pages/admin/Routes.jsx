import { useState, useEffect } from 'react';
import { getRoutes, createRoute, updateRoute, deleteRoute } from '../../api/api';

const AdminRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    routeName: '',
    startPoint: '',
    endPoint: '',
    totalStops: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await getRoutes();
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await updateRoute(editingRoute.id, formData);
      } else {
        await createRoute(formData);
      }
      fetchRoutes();
      resetForm();
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Failed to save route');
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      routeName: route.routeName,
      startPoint: route.startPoint,
      endPoint: route.endPoint,
      totalStops: route.totalStops,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this route?')) return;
    try {
      await deleteRoute(id);
      fetchRoutes();
    } catch (error) {
      console.error('Error deleting route:', error);
      alert('Failed to delete route');
    }
  };

  const resetForm = () => {
    setFormData({ routeName: '', startPoint: '', endPoint: '', totalStops: 0 });
    setEditingRoute(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const filteredRoutes = routes.filter(route =>
    route.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.startPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.endPoint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Manage Routes</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search routes..." 
            className="input flex-1 sm:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setShowForm(!showForm)} className="btn-primary whitespace-nowrap">
            {showForm ? 'Cancel' : '+ Add Route'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingRoute ? 'Edit' : 'Add'} Route</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Route Name</label>
              <input
                type="text"
                required
                value={formData.routeName}
                onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                className="input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Start Point</label>
                <input
                  type="text"
                  required
                  value={formData.startPoint}
                  onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">End Point</label>
                <input
                  type="text"
                  required
                  value={formData.endPoint}
                  onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })}
                  className="input"
                />
              </div>
            </div>
            <div>
              <label className="label">Total Stops</label>
              <input
                type="number"
                required
                value={formData.totalStops}
                onChange={(e) => setFormData({ ...formData, totalStops: parseInt(e.target.value) })}
                className="input"
              />
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stops</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRoutes.map((route) => (
              <tr key={route.id}>
                <td className="px-6 py-4 whitespace-nowrap">{route.routeName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{route.startPoint}</td>
                <td className="px-6 py-4 whitespace-nowrap">{route.endPoint}</td>
                <td className="px-6 py-4 whitespace-nowrap">{route.totalStops}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button onClick={() => handleEdit(route)} className="text-primary-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(route.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRoutes;
