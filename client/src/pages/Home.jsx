import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRoutes, getBuses } from '../api/api';
import RouteCard from '../components/RouteCard';
import BusCard from '../components/BusCard';

const Home = () => {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const [allBuses, setAllBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ routes: [], buses: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      const [routesRes, busesRes] = await Promise.all([getRoutes(), getBuses()]);
      setAllRoutes(routesRes.data);
      setAllBuses(busesRes.data);
      setRoutes(routesRes.data.slice(0, 3)); // Show only 3 featured routes
      setBuses(busesRes.data.slice(0, 4)); // Show only 4 featured buses
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setIsSearching(true);
    const lowerTerm = term.toLowerCase();

    // Search routes by name, start point, or end point
    const filteredRoutes = allRoutes.filter((route) =>
      route.routeName.toLowerCase().includes(lowerTerm) ||
      route.startPoint.toLowerCase().includes(lowerTerm) ||
      route.endPoint.toLowerCase().includes(lowerTerm)
    );

    // Search buses by bus number or route name
    const filteredBuses = allBuses.filter((bus) =>
      bus.busNumber.toLowerCase().includes(lowerTerm) ||
      bus.route?.routeName.toLowerCase().includes(lowerTerm)
    );

    setSearchResults({ routes: filteredRoutes, buses: filteredBuses });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section - Sairam Bus Connect */}
      <div className="bg-gradient-to-br from-primary to-primary-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-headline-lg sm:text-headline-lg-mobile font-bold mb-4 font-serif text-primary-100">
              Sairam Bus Connect
            </h1>
            <p className="text-body-lg text-primary-100 max-w-2xl mx-auto font-serif">
              Sri Sairam College Bus Tracking System. Real-time schedules, live tracking, and smart boarding points designed exclusively for students.
            </p>
          </div>

          {/* Elegant Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by bus license number or route name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 text-body-lg border-0 rounded-xl focus:ring-4 focus:ring-white/30 outline-none shadow-elevated bg-white text-on-surface"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{/* Rest of content */}

      {/* Search Results */}
      {isSearching && searchTerm && (
        <div className="mb-12">
          <h2 className="text-headline-md text-on-surface mb-6">
            Search Results for "{searchTerm}"
          </h2>

          {searchResults.routes.length === 0 && searchResults.buses.length === 0 && (
            <div className="text-center py-16 card">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-on-surface-variant text-body-lg">No results found. Try a different search term.</p>
            </div>
          )}

          {searchResults.routes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-headline-md mb-4">Routes ({searchResults.routes.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.routes.map((route) => (
                  <RouteCard key={route.id} route={route} />
                ))}
              </div>
            </div>
          )}

          {searchResults.buses.length > 0 && (
            <div>
              <h3 className="text-headline-md mb-4">Buses ({searchResults.buses.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResults.buses.map((bus) => (
                  <BusCard key={bus.id} bus={bus} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show regular content only if not searching */}
      {!isSearching && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card-elevated text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <p className="text-body-sm font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">Active Buses</p>
              <p className="text-headline-lg text-primary">{allBuses.length}</p>
            </div>
            <div className="card-elevated text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <p className="text-body-sm font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">Total Routes</p>
              <p className="text-headline-lg text-primary">{allRoutes.length}</p>
            </div>
            <div className="card-elevated text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-body-sm font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">Boarding Points</p>
              <p className="text-headline-lg text-primary">
                {allRoutes.reduce((acc, route) => acc + (route.boardingPoints?.length || 0), 0)}
              </p>
            </div>
          </div>

          {/* Featured Routes */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-headline-md text-on-surface">Featured Routes</h2>
              <Link to="/routes" className="text-primary-container hover:text-primary font-semibold flex items-center gap-2 text-body-lg">
                View All 
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </div>

          {/* Live Tracking Section */}
          <div className="mb-12">
            <h2 className="text-headline-md text-on-surface mb-6">Live Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {buses.map((bus) => (
                <BusCard key={bus.id} bus={bus} />
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-50 rounded-xl mb-4">
                <svg className="w-7 h-7 text-primary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-label-bold text-primary-container mb-2">Interactive Maps</h3>
              <p className="text-body-sm text-on-surface-variant">
                View all boarding points on an interactive map with exact locations
              </p>
            </div>
            <div className="card text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-50 rounded-xl mb-4">
                <svg className="w-7 h-7 text-primary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-label-bold text-primary-container mb-2">Bus Schedules</h3>
              <p className="text-body-sm text-on-surface-variant">
                Check arrival and departure times for all buses at every stop
              </p>
            </div>
            <div className="card text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-50 rounded-xl mb-4">
                <svg className="w-7 h-7 text-primary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-label-bold text-primary-container mb-2">Driver Information</h3>
              <p className="text-body-sm text-on-surface-variant">
                Access driver details including contact information for emergencies
              </p>
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default Home;
