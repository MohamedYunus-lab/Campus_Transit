import { useState, useEffect } from 'react';
import { getBoardingPoints, createBoardingPoint, updateBoardingPoint, deleteBoardingPoint, getRoutes } from '../../api/api';
import ImageUploadWidget from '../../components/ImageUploadWidget';

const AdminBoardingPoints = () => {
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPoint, setEditingPoint] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    routeId: '',
    imageUrl: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pointsRes, routesRes] = await Promise.all([
        getBoardingPoints(),
        getRoutes(),
      ]);
      setBoardingPoints(pointsRes.data);
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
      if (editingPoint) {
        await updateBoardingPoint(editingPoint.id, formData);
      } else {
        await createBoardingPoint(formData);
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving boarding point:', error);
      alert('Failed to save boarding point');
    }
  };

  const handleEdit = (point) => {
    setEditingPoint(point);
    setFormData({
      name: point.name,
      latitude: point.latitude,
      longitude: point.longitude,
      routeId: point.routeId,
      imageUrl: point.imageUrl || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this boarding point?')) return;
    try {
      await deleteBoardingPoint(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting boarding point:', error);
      alert('Failed to delete boarding point');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', latitude: '', longitude: '', routeId: '', imageUrl: '' });
    setEditingPoint(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const filteredBoardingPoints = boardingPoints.filter(point =>
    point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (point.route && point.route.routeName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Manage Boarding Points</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search points..." 
            className="input flex-1 sm:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setShowForm(!showForm)} className="btn-primary whitespace-nowrap">
            {showForm ? 'Cancel' : '+ Add Boarding Point'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingPoint ? 'Edit' : 'Add'} Boarding Point</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                required
                placeholder="Tambaram Railway Station"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Latitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="12.9226"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Longitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="80.1275"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="input"
                />
              </div>
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
            <div>
              <label className="label">Landmark Image URL (Optional)</label>
              <ImageUploadWidget
                onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                currentImage={formData.imageUrl}
                label="Upload or paste image URL"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-sm text-blue-800">
                💡 Tip: You can find coordinates using Google Maps. Right-click on a location and select the coordinates to copy them.
              </p>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coordinates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBoardingPoints.map((point) => (
              <tr key={point.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{point.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{point.route?.routeName}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button onClick={() => handleEdit(point)} className="text-primary-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(point.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBoardingPoints;
