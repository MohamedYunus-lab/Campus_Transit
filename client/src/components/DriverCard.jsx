const DriverCard = ({ driver }) => {
  return (
    <div className="card">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-primary-200">
            {driver.photoUrl ? (
              <img src={driver.photoUrl} alt={driver.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-gray-400">DRIVER</span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{driver.name}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Phone:</span>{' '}
              <a href={`tel:${driver.phoneNumber}`} className="text-primary-600 hover:underline">
                {driver.phoneNumber}
              </a>
            </p>
            <p>
              <span className="font-medium">ID:</span> {driver.idCardNumber}
            </p>
            {driver.bus && (
              <p>
                <span className="font-medium">Bus:</span> {driver.bus.busNumber}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;
