import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ boardingPoints, center, zoom = 12 }) => {
  // Default center to Chennai if not provided
  const mapCenter = center || [13.0827, 80.2707];

  // Sort boarding points by some order if they have schedules, or just use their given order
  // For safety, we'll just use the array order provided
  const validPoints = boardingPoints?.filter(bp => bp.latitude && bp.longitude) || [];
  
  // Create polyline coordinates
  const polylinePositions = validPoints.map(bp => [bp.latitude, bp.longitude]);

  // Generate Google Maps Directions URL
  const generateGoogleMapsUrl = () => {
    if (validPoints.length === 0) return '#';
    const coords = validPoints.map(p => `${p.latitude},${p.longitude}`).join('/');
    return `https://www.google.com/maps/dir/${coords}`;
  };

  // Custom DivIcon creator for numbered markers
  const createNumberedIcon = (number, isFirst, isLast) => {
    let bgColor = 'bg-primary'; // default blue
    if (isFirst) bgColor = 'bg-green-500'; // start point
    if (isLast) bgColor = 'bg-red-500'; // end point (college)
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="${bgColor} text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white transform transition-transform hover:scale-110">
               ${number}
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  };

  return (
    <div className="relative flex flex-col h-[500px] w-full rounded-xl overflow-hidden shadow-card border border-gray-100 group">
      {/* Google Maps Button Overlay */}
      {validPoints.length > 0 && (
        <a
          href={generateGoogleMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-[400] flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl text-primary-700 hover:text-primary-800 font-semibold transition-all hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Open in Google Maps
        </a>
      )}

      <MapContainer center={mapCenter} zoom={zoom} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Draw stylized route line */}
        {polylinePositions.length > 1 && (
          <>
            {/* Outline for shadow effect */}
            <Polyline positions={polylinePositions} color="#000000" weight={6} opacity={0.15} />
            {/* Main dashed route line */}
            <Polyline 
              positions={polylinePositions} 
              color="#004ac6" 
              weight={4} 
              opacity={0.8} 
              dashArray="10, 10" 
              lineCap="round"
            />
          </>
        )}
        
        {/* Numbered Markers for boarding points */}
        {validPoints.map((point, index) => {
          const isFirst = index === 0;
          const isLast = index === validPoints.length - 1;
          
          return (
            <Marker 
              key={point.id} 
              position={[point.latitude, point.longitude]}
              icon={createNumberedIcon(index + 1, isFirst, isLast)}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </span>
                    <h3 className="font-bold text-gray-900 m-0 text-base leading-tight">{point.name}</h3>
                  </div>
                  
                  {point.imageUrl && (
                    <img 
                      src={point.imageUrl} 
                      alt={point.name} 
                      className="w-full h-24 object-cover rounded-md mb-3 shadow-sm"
                    />
                  )}

                  {point.schedules && point.schedules.length > 0 && (
                    <div className="mt-3 bg-gray-50 rounded p-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Bus Timings</p>
                      <ul className="space-y-1.5">
                        {point.schedules.map((schedule) => (
                          <li key={schedule.id} className="flex justify-between items-center text-sm">
                            <span className="font-medium text-gray-800">{schedule.arrivalTime}</span>
                            <span className="text-gray-500 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                              Bus {schedule.bus?.busNumber || 'N/A'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
