import { Link } from 'react-router-dom';

const BusCard = ({ bus }) => {
  // Calculate a mock capacity percentage (in real app, this would come from live tracking data)
  const capacityPercentage = Math.floor(Math.random() * 40) + 30; // Random 30-70% for demo
  const isAlmostFull = capacityPercentage >= 60;

  return (
    <Link to={`/bus/${bus.id}`} className="card hover:shadow-elevated transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-label-bold text-on-surface mb-2">{bus.busNumber}</h3>
          <p className="text-body-sm text-on-surface-variant">
            {bus.route?.routeName}
          </p>
        </div>
        <span className="badge-active">ACTIVE</span>
      </div>

      {/* Capacity Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body-sm text-on-surface-variant">Capacity</span>
          <span className={`text-body-sm font-semibold ${isAlmostFull ? 'text-error' : 'text-success'}`}>
            {capacityPercentage}%
          </span>
        </div>
        <div className="w-full bg-surface-container rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${isAlmostFull ? 'bg-error' : 'bg-success'}`}
            style={{ width: `${capacityPercentage}%` }}
          ></div>
        </div>
        <p className="text-body-sm text-on-surface-variant mt-1">
          {bus.capacity} total seats
        </p>
      </div>

      {bus.driver && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-surface-container rounded-lg">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-body-sm font-medium text-on-surface">{bus.driver.name}</p>
            <p className="text-body-sm text-on-surface-variant">Driver</p>
          </div>
        </div>
      )}

      {bus.schedules && bus.schedules.length > 0 && (
        <div className="mt-4 pt-4 border-t border-outline-variant">
          <p className="text-body-sm text-on-surface-variant mb-2 font-medium">Next Stops:</p>
          <div className="space-y-2">
            {bus.schedules.slice(0, 2).map((schedule) => (
              <div key={schedule.id} className="flex justify-between items-center text-body-sm">
                <span className="text-on-surface truncate flex-1">{schedule.boardingPoint?.name}</span>
                <span className="text-primary-container font-semibold ml-2">{schedule.arrivalTime}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center text-primary-container group-hover:text-primary text-body-sm font-semibold">
        Track Live
        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};

export default BusCard;
