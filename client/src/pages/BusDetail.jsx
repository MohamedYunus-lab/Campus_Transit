import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBus } from '../api/api';
import DriverCard from '../components/DriverCard';
import MapView from '../components/MapView';

const BusDetail = () => {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBus();
  }, [id]);

  const fetchBus = async () => {
    try {
      const response = await getBus(id);
      setBus(response.data);
    } catch (error) {
      console.error('Error fetching bus:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bus details...</p>
        </div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Bus not found</p>
          <Link to="/" className="text-primary-600 hover:underline mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="text-primary-600 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bus Details */}
          <div className="card">
            <div className="flex items-start space-x-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{bus.busNumber}</h1>
                <p className="text-gray-600">Capacity: {bus.capacity} seats</p>
              </div>
            </div>

            {bus.route && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Route Information</h3>
                <Link to={`/routes/${bus.route.id}`} className="text-primary-600 hover:underline">
                  {bus.route.routeName}
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  {bus.route.startPoint} → {bus.route.endPoint}
                </p>
              </div>
            )}
          </div>

          {/* Schedule */}
          {bus.schedules && bus.schedules.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Schedule</h2>
              <div className="space-y-3">
                {bus.schedules.map((schedule, index) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{schedule.boardingPoint?.name}</p>
                        <p className="text-xs text-gray-500">
                          Location: {schedule.boardingPoint?.latitude.toFixed(4)}, {schedule.boardingPoint?.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Arrival</p>
                        <p className="font-semibold text-primary-600">{schedule.arrivalTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Departure</p>
                        <p className="font-semibold text-gray-700">{schedule.departureTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          {bus.route?.boardingPoints && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Route Map</h2>
              <MapView boardingPoints={bus.route.boardingPoints} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Driver Info */}
          {bus.driver && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Driver Information</h2>
              <DriverCard driver={bus.driver} />
            </div>
          )}

          {/* Quick Stats */}
          <div className="card">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Stops</span>
                <span className="font-semibold">{bus.schedules?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity</span>
                <span className="font-semibold">{bus.capacity} seats</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetail;
