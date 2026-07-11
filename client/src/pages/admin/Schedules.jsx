import { useState, useEffect } from 'react';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule, getBuses, getBoardingPoints } from '../../api/api';

const AdminSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    busId: '',
    boardingPointId: '',
    arrivalTime: '',
    departureTime: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schedulesRes, busesRes, pointsRes] = await Promise.all([
        getSchedules(),
        getBuses(),
        getBoardingPoints(),
      ]);
      setSchedules(schedulesRes.data);
      setBuses(busesRes.data);
      setBoardingPoints(pointsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, formData);
      } else {
        await createSchedule(formData);
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule. Make sure this bus-stop combination does not already exist.');
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      busId: schedule.busId,
      boardingPointId: schedule.boardingPointId,
      arrivalTime: schedule.arrivalTime,
      departureTime: schedule.departureTime,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await deleteSchedule(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('Failed to delete schedule');
    }
  };

  const resetForm = () => {
    setFormData({ busId: '', boardingPointId: '', arrivalTime: '', departureTime: '' });
    setEditingSchedule(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const filteredSchedules = schedules.filter(schedule =>
    (schedule.bus && schedule.bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (schedule.boardingPoint && schedule.boardingPoint.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (schedule.bus && schedule.bus.route && schedule.bus.route.routeName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Manage Schedules</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search schedules..." 
            className="input flex-1 sm:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setShowForm(!showForm)} className="btn-primary whitespace-nowrap">
            {showForm ? 'Cancel' : '+ Add Schedule'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingSchedule ? 'Edit' : 'Add'} Schedule</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Bus</label>
              <select
                required
                value={formData.busId}
                onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
                className="input"
              >
                <option value="">Select Bus</option>
                {buses.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.busNumber} - {bus.route?.routeName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Boarding Point</label>
              <select
                required
                value={formData.boardingPointId}
                onChange={(e) => setFormData({ ...formData, boardingPointId: e.target.value })}
                className="input"
              >
                <option value="">Select Boarding Point</option>
                {boardingPoints.map((point) => (
                  <option key={point.id} value={point.id}>
                    {point.name} ({point.route?.routeName})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Arrival Time</label>
                <input
                  type="time"
                  required
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Departure Time</label>
                <input
                  type="time"
                  required
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  className="input"
                />
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ Note: Each bus can only have one schedule entry per boarding point.
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boarding Point</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arrival</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departure</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSchedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{schedule.bus?.busNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.boardingPoint?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{schedule.bus?.route?.routeName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-primary-600 font-medium">{schedule.arrivalTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.departureTime}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button onClick={() => handleEdit(schedule)} className="text-primary-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(schedule.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSchedules;
