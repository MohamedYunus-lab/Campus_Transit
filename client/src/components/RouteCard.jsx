import { Link } from 'react-router-dom';

const RouteCard = ({ route }) => {
  // Assign colors to routes based on ID for variety
  const getRouteBadgeClass = (id) => {
    const colors = ['route-badge-blue', 'route-badge-orange', 'route-badge-purple'];
    return colors[id % 3];
  };

  return (
    <Link to={`/routes/${route.id}`} className="card hover:shadow-elevated transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className={`${getRouteBadgeClass(route.id)}`}>
              {route.routeName}
            </span>
            <span className="badge-active">ACTIVE</span>
          </div>
          <div className="flex items-center space-x-2 text-body-sm text-on-surface-variant">
            <span className="font-medium">{route.startPoint}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium">{route.endPoint}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-outline-variant">
        <div>
          <p className="text-body-sm text-on-surface-variant mb-1">Total Stops</p>
          <p className="text-headline-md text-primary">{route.boardingPoints?.length || route.totalStops}</p>
        </div>
        <div>
          <p className="text-body-sm text-on-surface-variant mb-1">Buses</p>
          <p className="text-headline-md text-primary">{route.buses?.length || 0}</p>
        </div>
      </div>
      
      {route.buses && route.buses.length > 0 && (
        <div className="mt-4">
          <p className="text-body-sm text-on-surface-variant mb-2">Bus License Numbers:</p>
          <div className="flex flex-wrap gap-2">
            {route.buses.map((bus) => (
              <span key={bus.id} className="badge-secondary">
                {bus.busNumber}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 flex items-center text-primary-container group-hover:text-primary text-body-sm font-semibold">
        View Details
        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};

export default RouteCard;
