import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRoutes, getBuses, getDrivers, getBoardingPoints } from '../../api/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    routes: 0,
    buses: 0,
    drivers: 0,
    boardingPoints: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [routesRes, busesRes, driversRes, pointsRes] = await Promise.all([
        getRoutes(),
        getBuses(),
        getDrivers(),
        getBoardingPoints(),
      ]);
      setStats({
        routes: routesRes.data.length,
        buses: busesRes.data.length,
        drivers: driversRes.data.length,
        boardingPoints: pointsRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-container mx-auto"></div>
          <p className="mt-4 text-on-surface-variant">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      action: () => setActiveSection('dashboard')
    },
    { 
      id: 'buses', 
      name: 'Manage Buses', 
      path: '/admin/buses',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    { 
      id: 'routes', 
      name: 'Route Mapping', 
      path: '/admin/routes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    { 
      id: 'drivers', 
      name: 'Drivers', 
      path: '/admin/drivers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    { 
      id: 'schedules', 
      name: 'Schedules', 
      path: '/admin/schedules',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    { 
      id: 'boarding', 
      name: 'Boarding Points', 
      path: '/admin/boarding-points',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest shadow-elevated">
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-outline-variant">
            <h2 className="text-headline-md text-primary">Admin Panel</h2>
            <p className="text-body-sm text-on-surface-variant mt-1">Sri Sairam College</p>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              item.path ? (
                <Link
                  key={item.id}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-body-lg text-on-surface hover:bg-surface-container transition-colors"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-body-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary-100 text-primary font-semibold'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              )
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-headline-lg text-on-surface mb-2">Dashboard Overview</h1>
            <p className="text-body-lg text-on-surface-variant">Manage your college bus transit system</p>
          </div>

          {/* Add Bus to Route CTA */}
          <Link
            to="/admin/add-complete-route"
            className="block mb-8 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white p-8 rounded-xl shadow-elevated hover:shadow-card-hover transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-headline-md mb-2 font-bold">Add Bus to Route</h2>
                <p className="text-primary-100 text-body-lg">Create new route or add bus to existing route with schedules</p>
              </div>
              <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Stats Grid with Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card-elevated">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-body-sm text-on-surface-variant mb-1">Total Routes</p>
                  <p className="text-headline-lg text-primary">{stats.routes}</p>
                </div>
              </div>
            </div>

            <div className="card-elevated">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-body-sm text-on-surface-variant mb-1">Active Buses</p>
                  <p className="text-headline-lg text-primary">{stats.buses}</p>
                </div>
              </div>
            </div>

            <div className="card-elevated">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-body-sm text-on-surface-variant mb-1">Drivers</p>
                  <p className="text-headline-lg text-primary">{stats.drivers}</p>
                </div>
              </div>
            </div>

            <div className="card-elevated">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-body-sm text-on-surface-variant mb-1">Boarding Points</p>
                  <p className="text-headline-lg text-primary">{stats.boardingPoints}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-headline-md mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sidebarItems.slice(1).map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="card hover:shadow-elevated transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-container group-hover:bg-primary-100 transition-colors">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-label-bold text-on-surface group-hover:text-primary-container transition-colors">{item.name}</p>
                      <p className="text-body-sm text-on-surface-variant">Manage {item.name.toLowerCase()}</p>
                    </div>
                    <svg className="w-5 h-5 text-outline group-hover:text-primary-container group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
