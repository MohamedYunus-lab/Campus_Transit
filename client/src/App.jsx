import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RoutesPage from './pages/Routes';
import RouteDetail from './pages/RouteDetail';
import BusDetail from './pages/BusDetail';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminRoutes from './pages/admin/Routes';
import AdminBuses from './pages/admin/Buses';
import AdminDrivers from './pages/admin/Drivers';
import AdminBoardingPoints from './pages/admin/BoardingPoints';
import AdminSchedules from './pages/admin/Schedules';
import AddCompleteRoute from './pages/admin/AddCompleteRoute';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/routes/:id" element={<RouteDetail />} />
          <Route path="/bus/:id" element={<BusDetail />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/routes"
            element={
              <ProtectedRoute>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/buses"
            element={
              <ProtectedRoute>
                <AdminBuses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/drivers"
            element={
              <ProtectedRoute>
                <AdminDrivers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/boarding-points"
            element={
              <ProtectedRoute>
                <AdminBoardingPoints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schedules"
            element={
              <ProtectedRoute>
                <AdminSchedules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-complete-route"
            element={
              <ProtectedRoute>
                <AddCompleteRoute />
              </ProtectedRoute>
            }
          />
        </Routes>
        
        {/* Discreet Footer */}
        <footer className="bg-white py-6 mt-auto border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Sri Sairam College. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
