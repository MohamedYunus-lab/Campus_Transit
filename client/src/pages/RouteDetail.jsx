import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRoute } from '../api/api';
import MapView from '../components/MapView';

const RouteDetail = () => {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoute();
  }, [id]);

  const fetchRoute = async () => {
    try {
      const response = await getRoute(id);
      setRoute(response.data);
    } catch (error) {
      console.error('Error fetching route:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-container mx-auto"></div>
          <p className="mt-4 text-on-surface-variant">Loading route details...</p>
        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center card">
          <p className="text-on-surface-variant text-body-lg">Route not found</p>
          <Link to="/routes" className="text-primary-container hover:text-primary mt-4 inline-block font-semibold">
            ← Back to Routes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/routes" className="text-primary-container hover:text-primary mb-6 inline-flex items-center gap-2 font-semibold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Routes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="card-elevated sticky top-8">
              <h1 className="text-headline-md text-on-surface mb-4">{route.routeName}</h1>
              <div className="flex items-center gap-2 text-body-lg text-on-surface-variant mb-4">
                <span className="font-medium">{route.startPoint}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium">{route.endPoint}</span>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className="badge-active">ACTIVE</span>
              </div>

              <div className="space-y-4 pt-4 border-t border-outline-variant">
                <div className="flex items-center justify-between">
                  <span className="text-body-sm text-on-surface-variant">Total Stops</span>
                  <span className="text-headline-md text-primary">{route.boardingPoints?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body-sm text-on-surface-variant">Active Buses</span>
                  <span className="text-headline-md text-primary">{route.buses?.length || 0}</span>
                </div>
              </div>

              {/* Buses on this route */}
              {route.buses && route.buses.length > 0 && (
                <div className="mt-6 pt-6 border-t border-outline-variant">
                  <h3 className="text-label-bold text-on-surface mb-3">Buses on Route</h3>
                  <div className="space-y-2">
                    {route.buses.map((bus) => (
                      <Link 
                        key={bus.id} 
                        to={`/bus/${bus.id}`} 
                        className="flex items-center justify-between p-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors"
                      >
                        <div>
                          <p className="text-body-sm font-semibold text-on-surface">{bus.busNumber}</p>
                          {bus.driver && (
                            <p className="text-body-sm text-on-surface-variant">{bus.driver.name}</p>
                          )}
                        </div>
                        <span className="badge-secondary">{bus.capacity} seats</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Map */}
            <div className="mb-8">
              <h2 className="text-headline-md text-on-surface mb-4">Route Map</h2>
              <div className="card-elevated">
                <MapView boardingPoints={route.boardingPoints} />
              </div>
            </div>

            {/* Boarding Points with Schedules */}
            <div>
              <h2 className="text-headline-md text-on-surface mb-4">Boarding Points & Schedules</h2>
              <div className="space-y-4">
                {route.boardingPoints?.map((point, index) => (
                  <div key={point.id} className="card">
                    <div className="flex items-start gap-4">
                      {/* Stop Number */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary-100 text-primary flex items-center justify-center font-bold text-body-lg">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-label-bold text-on-surface mb-2">{point.name}</h3>
                        <p className="text-body-sm text-on-surface-variant mb-4 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                        </p>
                        
                        {/* Landmark Image */}
                        {point.imageUrl && (
                          <div className="mb-4">
                            <img 
                              src={point.imageUrl} 
                              alt={`${point.name} landmark`}
                              className="w-full max-w-lg h-56 object-cover rounded-lg shadow-card"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                            <p className="text-body-sm text-on-surface-variant mt-2 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Landmark photo to help locate the stop
                            </p>
                          </div>
                        )}
                        
                        {/* Bus Timings */}
                        {point.schedules && point.schedules.length > 0 && (
                          <div>
                            <p className="text-label-bold text-on-surface mb-3">Bus Timings</p>
                            <div className="space-y-2">
                              {point.schedules.map((schedule) => (
                                <div key={schedule.id} className="flex items-center justify-between bg-surface-container p-4 rounded-lg">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                      </svg>
                                    </div>
                                    <div>
                                      <span className="text-body-sm font-semibold text-on-surface">{schedule.bus?.busNumber}</span>
                                      {schedule.bus?.driver && (
                                        <p className="text-body-sm text-on-surface-variant">
                                          Driver: {schedule.bus.driver.name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                    <div className="text-right">
                                      <p className="text-body-sm text-on-surface-variant">Arrival</p>
                                      <p className="text-body-lg font-bold text-primary-container">{schedule.arrivalTime}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-body-sm text-on-surface-variant">Departure</p>
                                      <p className="text-body-lg font-bold text-on-surface">{schedule.departureTime}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetail;
