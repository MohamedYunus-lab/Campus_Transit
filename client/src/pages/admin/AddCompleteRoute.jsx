import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoute, createBoardingPoint, createBus, createSchedule, getDrivers, getRoutes } from '../../api/api';
import ImageUploadWidget from '../../components/ImageUploadWidget';

const AddCompleteRoute = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Route Selection
  const [routeMode, setRouteMode] = useState('new'); // 'new' or 'existing'
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [existingRoutes, setExistingRoutes] = useState([]);
  
  // Step 1: New Route Info
  const [routeData, setRouteData] = useState({
    routeName: '',
    startPoint: '',
    endPoint: '',
  });

  // Step 2: Boarding Points (only for new route)
  const [boardingPoints, setBoardingPoints] = useState([
    { name: '', latitude: '', longitude: '', imageUrl: '', arrivalTime: '', departureTime: '' }
  ]);

  // Step 3: Driver Selection
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [availableDrivers, setAvailableDrivers] = useState([]);

  // Step 4: Bus Info
  const [busData, setBusData] = useState({
    busNumber: '',
    capacity: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [driversRes, routesRes] = await Promise.all([getDrivers(), getRoutes()]);
      setAvailableDrivers(driversRes.data);
      setExistingRoutes(routesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addBoardingPoint = () => {
    setBoardingPoints([...boardingPoints, { name: '', latitude: '', longitude: '', imageUrl: '', arrivalTime: '', departureTime: '' }]);
  };

  const removeBoardingPoint = (index) => {
    setBoardingPoints(boardingPoints.filter((_, i) => i !== index));
  };

  const updateBoardingPoint = (index, field, value) => {
    const updated = [...boardingPoints];
    updated[index][field] = value;
    setBoardingPoints(updated);
  };

  const handleSubmitAll = async () => {
    setLoading(true);
    try {
      let routeId;

      // Step 1: Get or Create Route
      if (routeMode === 'existing') {
        routeId = parseInt(selectedRouteId);
      } else {
        const routeResponse = await createRoute({
          ...routeData,
          totalStops: boardingPoints.length,
        });
        routeId = routeResponse.data.id;

        // Step 2: Create Boarding Points (only for new route)
        for (const point of boardingPoints) {
          await createBoardingPoint({
            name: point.name,
            latitude: parseFloat(point.latitude),
            longitude: parseFloat(point.longitude),
            imageUrl: point.imageUrl || '',
            routeId: routeId,
          });
        }
      }

      // Step 3: Create Bus
      const busResponse = await createBus({
        busNumber: busData.busNumber,
        capacity: parseInt(busData.capacity),
        driverId: parseInt(selectedDriverId),
        routeId: routeId,
      });
      const busId = busResponse.data.id;

      // Step 4: Create Schedules
      if (routeMode === 'existing') {
        // For existing route, we need to get boarding points
        const selectedRoute = existingRoutes.find(r => r.id === parseInt(selectedRouteId));
        if (selectedRoute && selectedRoute.boardingPoints) {
          for (const point of selectedRoute.boardingPoints) {
            // Find matching boarding point with time
            const matchingPoint = boardingPoints.find(bp => bp.boardingPointId === point.id);
            if (matchingPoint) {
              await createSchedule({
                busId: busId,
                boardingPointId: point.id,
                arrivalTime: matchingPoint.arrivalTime,
                departureTime: matchingPoint.departureTime,
              });
            }
          }
        }
      } else {
        // For new route, boarding points are already created, get them from API
        const routeResponse = await getRoutes();
        const createdRoute = routeResponse.data.find(r => r.id === routeId);
        
        if (createdRoute && createdRoute.boardingPoints) {
          for (let i = 0; i < createdRoute.boardingPoints.length; i++) {
            const point = createdRoute.boardingPoints[i];
            const originalPoint = boardingPoints[i];
            
            await createSchedule({
              busId: busId,
              boardingPointId: point.id,
              arrivalTime: originalPoint.arrivalTime,
              departureTime: originalPoint.departureTime,
            });
          }
        }
      }

      alert('Bus added successfully to route!');
      navigate('/admin');
    } catch (error) {
      console.error('Error creating bus:', error);
      alert('Failed to create. Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Add Bus to Route</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {s}
              </div>
              {s < 4 && (
                <div className={`w-20 h-1 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Route Info</span>
          <span className={step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Stops/Timings</span>
          <span className={step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Driver</span>
          <span className={step >= 4 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Bus Info</span>
        </div>
      </div>

      {/* Step 1: Route Selection */}
      {step === 1 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Step 1: Select or Create Route</h2>
          <div className="space-y-4">
            {/* Route Mode Selection */}
            <div>
              <label className="label">What would you like to do? *</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="routeMode"
                    value="new"
                    checked={routeMode === 'new'}
                    onChange={(e) => setRouteMode(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Create New Route</p>
                    <p className="text-xs text-gray-500">Add a completely new route with boarding points</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="routeMode"
                    value="existing"
                    checked={routeMode === 'existing'}
                    onChange={(e) => setRouteMode(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Add Bus to Existing Route</p>
                    <p className="text-xs text-gray-500">Add another bus to an existing route</p>
                  </div>
                </label>
              </div>
            </div>

            {/* New Route Form */}
            {routeMode === 'new' && (
              <>
                <div>
                  <label className="label">Route Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Route 1 - Tambaram to College"
                    value={routeData.routeName}
                    onChange={(e) => setRouteData({ ...routeData, routeName: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Start Point *</label>
                    <input
                      type="text"
                      required
                      placeholder="Tambaram"
                      value={routeData.startPoint}
                      onChange={(e) => setRouteData({ ...routeData, startPoint: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">End Point *</label>
                    <input
                      type="text"
                      required
                      placeholder="College Campus"
                      value={routeData.endPoint}
                      onChange={(e) => setRouteData({ ...routeData, endPoint: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Existing Route Selection */}
            {routeMode === 'existing' && (
              <div>
                <label className="label">Select Existing Route *</label>
                <select
                  required
                  value={selectedRouteId}
                  onChange={(e) => {
                    setSelectedRouteId(e.target.value);
                    // Load boarding points for schedule entry
                    const route = existingRoutes.find(r => r.id === parseInt(e.target.value));
                    if (route && route.boardingPoints) {
                      setBoardingPoints(route.boardingPoints.map(bp => ({
                        boardingPointId: bp.id,
                        name: bp.name,
                        latitude: bp.latitude,
                        longitude: bp.longitude,
                        imageUrl: bp.imageUrl || '',
                        arrivalTime: '',
                        departureTime: ''
                      })));
                    }
                  }}
                  className="input"
                >
                  <option value="">-- Select a route --</option>
                  {existingRoutes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.routeName} ({route.startPoint} → {route.endPoint})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select an existing route to add another bus to it
                </p>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={
                (routeMode === 'new' && (!routeData.routeName || !routeData.startPoint || !routeData.endPoint)) ||
                (routeMode === 'existing' && !selectedRouteId)
              }
              className="btn-primary disabled:opacity-50"
            >
              Next: {routeMode === 'new' ? 'Add Boarding Points' : 'Enter Bus Timings'} →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Boarding Points or Timings */}
      {step === 2 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            Step 2: {routeMode === 'new' ? 'Add Boarding Points & Timings' : 'Enter Bus Timings'}
          </h2>
          <div className="space-y-6">
            {boardingPoints.map((point, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">
                    {routeMode === 'existing' ? point.name : `Stop #${index + 1}`}
                  </h3>
                  {routeMode === 'new' && boardingPoints.length > 1 && (
                    <button
                      onClick={() => removeBoardingPoint(index)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {routeMode === 'new' && (
                    <>
                      <div>
                        <label className="label">Boarding Point Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Tambaram Railway Station"
                          value={point.name}
                          onChange={(e) => updateBoardingPoint(index, 'name', e.target.value)}
                          className="input"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="label">Latitude *</label>
                          <input
                            type="number"
                            step="any"
                            required
                            placeholder="12.9226"
                            value={point.latitude}
                            onChange={(e) => updateBoardingPoint(index, 'latitude', e.target.value)}
                            className="input"
                          />
                        </div>
                        <div>
                          <label className="label">Longitude *</label>
                          <input
                            type="number"
                            step="any"
                            required
                            placeholder="80.1275"
                            value={point.longitude}
                            onChange={(e) => updateBoardingPoint(index, 'longitude', e.target.value)}
                            className="input"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="label">Landmark Image URL (Optional)</label>
                        <ImageUploadWidget
                          onImageUpload={(url) => updateBoardingPoint(index, 'imageUrl', url)}
                          currentImage={point.imageUrl}
                          label="Upload or paste image URL"
                        />
                      </div>
                    </>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Arrival Time *</label>
                      <input
                        type="time"
                        value={point.arrivalTime}
                        onChange={(e) => updateBoardingPoint(index, 'arrivalTime', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Departure Time *</label>
                      <input
                        type="time"
                        value={point.departureTime}
                        onChange={(e) => updateBoardingPoint(index, 'departureTime', e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {routeMode === 'new' && (
              <button onClick={addBoardingPoint} className="btn-secondary w-full">
                + Add Another Boarding Point
              </button>
            )}
            <div className="flex space-x-2">
              <button onClick={() => setStep(1)} className="btn-secondary">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={boardingPoints.some(p => 
                  (routeMode === 'new' && (!p.name || !p.latitude || !p.longitude)) || 
                  !p.arrivalTime || !p.departureTime
                )}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                Next: Select Driver →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Select Driver */}
      {step === 3 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Step 3: Select Driver</h2>
          <div className="space-y-4">
            {availableDrivers && availableDrivers.length > 0 ? (
              <>
                <div>
                  <label className="label">Select Driver *</label>
                  <select
                    required
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    className="input"
                  >
                    <option value="">-- Select a driver --</option>
                    {availableDrivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} - {driver.idCardNumber}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select from existing drivers. Driver details will be automatically used.
                  </p>
                </div>

                {selectedDriverId && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Selected Driver Details</h3>
                    {(() => {
                      const driver = availableDrivers.find(d => d.id === parseInt(selectedDriverId));
                      return driver ? (
                        <div className="text-sm space-y-1">
                          <p><strong>Name:</strong> {driver.name}</p>
                          <p><strong>Phone:</strong> {driver.phoneNumber}</p>
                          <p><strong>ID Card:</strong> {driver.idCardNumber}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> If you need to add a new driver, please go to "Manage Drivers" section first and add the driver, then return here.
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button onClick={() => setStep(2)} className="btn-secondary">
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={!selectedDriverId}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    Next: Add Bus Info →
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No drivers available</p>
                <button onClick={() => setStep(2)} className="btn-secondary">
                  ← Back
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Bus Information */}
      {step === 4 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Step 4: Bus License & Capacity</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Bus License Number *</label>
              <input
                type="text"
                required
                placeholder="TN-01-AB-1234"
                value={busData.busNumber}
                onChange={(e) => setBusData({ ...busData, busNumber: e.target.value })}
                className="input"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter vehicle license plate number (e.g., TN-01-AB-1234)
              </p>
            </div>
            <div>
              <label className="label">Capacity (Number of Seats) *</label>
              <input
                type="number"
                required
                placeholder="50"
                value={busData.capacity}
                onChange={(e) => setBusData({ ...busData, capacity: e.target.value })}
                className="input"
              />
            </div>

            {/* Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-6">
              <h3 className="font-semibold mb-2">Summary</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Mode:</strong> {routeMode === 'new' ? 'New Route' : 'Existing Route'}</li>
                {routeMode === 'new' ? (
                  <li><strong>Route:</strong> {routeData.routeName}</li>
                ) : (
                  <li><strong>Route:</strong> {existingRoutes.find(r => r.id === parseInt(selectedRouteId))?.routeName}</li>
                )}
                <li><strong>Boarding Points:</strong> {boardingPoints.length}</li>
                <li><strong>Driver:</strong> {availableDrivers.find(d => d.id === parseInt(selectedDriverId))?.name || 'Not selected'}</li>
                <li><strong>Bus License:</strong> {busData.busNumber}</li>
                <li><strong>Capacity:</strong> {busData.capacity} seats</li>
              </ul>
            </div>

            <div className="flex space-x-2">
              <button onClick={() => setStep(3)} className="btn-secondary">
                ← Back
              </button>
              <button
                onClick={handleSubmitAll}
                disabled={!busData.busNumber || !busData.capacity || loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Creating...' : routeMode === 'new' ? 'Create Route & Bus' : 'Add Bus to Route'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCompleteRoute;
