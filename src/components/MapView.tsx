'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polygon, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Location, Report, Emotion } from '../types'
import { AlertTriangle, Construction, EyeOff, Footprints, Lightbulb, ShipWheelIcon as Wheelchair, HelpCircle } from 'lucide-react'

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
})

const emotionColors: Record<Emotion['emotion'], string> = {
  pleasant: '#4CAF50',
  neutral: '#9E9E9E',
  uncomfortable: '#FFC107',
  unsafe: '#F44336'
}

const issueIcons: Record<string, React.ReactNode> = {
  broken_pavement: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-x-inside"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><path d="m14.5 7.5-5 5"/><path d="m9.5 7.5 5 5"/></svg>`,
  missing_sidewalk:  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-x-inside"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><path d="m14.5 7.5-5 5"/><path d="m9.5 7.5 5 5"/></svg>`,
  obstruction:  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-x-inside"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><path d="m14.5 7.5-5 5"/><path d="m9.5 7.5 5 5"/></svg>`,
  no_ramps:  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-x-inside"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><path d="m14.5 7.5-5 5"/><path d="m9.5 7.5 5 5"/></svg>`,
  poor_lighting:  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-x-inside"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><path d="m14.5 7.5-5 5"/><path d="m9.5 7.5 5 5"/></svg>`,
  others:  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-x-inside"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><path d="m14.5 7.5-5 5"/><path d="m9.5 7.5 5 5"/></svg>`,
}

interface MapViewProps {
  locations: Location[];
  reports: Report[];
  emotions: Emotion[];
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  onReportLocation: (lat: number, lng: number, locationId: string) => void;
  onEmotionLocation: (locationId: string) => void;
}

const MapView: React.FC<MapViewProps> = ({ 
  locations, 
  reports, 
  emotions, 
  selectedArea, 
  setSelectedArea,
  onReportLocation,
  onEmotionLocation
}) => {
  const [viewMode, setViewMode] = useState<'report' | 'emotion'>('report')

  const filteredLocations = selectedArea === 'all' 
    ? locations 
    : locations.filter(location => location.area === selectedArea)

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const clickedLocation = filteredLocations.find(location => 
          isPointInPolygon([e.latlng.lng, e.latlng.lat], location.geometry.coordinates[0])
        )
        if (clickedLocation) {
          if (viewMode === 'report') {
            onReportLocation(e.latlng.lat, e.latlng.lng, clickedLocation._id)
          } else {
            onEmotionLocation(clickedLocation._id)
          }
        }
      },
    })
    return null
  }

  // Helper function to check if a point is inside a polygon
  const isPointInPolygon = (point: [number, number], polygon: [number, number][]) => {
    const x = point[0], y = point[1]
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1]
      const xj = polygon[j][0], yj = polygon[j][1]
      const intersect = ((yi > y) !== (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
      if (intersect) inside = !inside
    }
    return inside
  }

  // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
  const convertCoordinates = (coordinates: [number, number][]): [number, number][] => {
    return coordinates.map(([lng, lat]) => [lat, lng])
  }

  // Calculate overall emotion for a location
  const getOverallEmotion = (locationId: string): Emotion['emotion'] => {
    console.log(locationId)
    const locationEmotions = emotions.filter(e => e.location._id === locationId)
    console.log(emotions)
    console.log(locationEmotions)
    if (locationEmotions.length === 0) return 'neutral'
    
    const emotionCounts = locationEmotions.reduce((acc, emotion) => {
      acc[emotion.emotion] = (acc[emotion.emotion] || 0) + 1
      return acc
    }, {} as Record<Emotion['emotion'], number>)

    return Object.entries(emotionCounts).reduce((a, b) => emotionCounts[a[0] as Emotion['emotion']] > emotionCounts[b[0] as Emotion['emotion']] ? a : b)[0] as Emotion['emotion']
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
            <div className="flex space-x-2 pb-4">
            <span className='absolute top-0 right-0 p-4'>Issue Map</span>
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '400px', width: '100%' }}>
          <MapContainer 
            center={[14.66, 121.06]} // Centered on the approximate area
            zoom={13} 
            style={{ height: '170%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapEvents />
            {filteredLocations.map((location) => {
              const convertedCoordinates = convertCoordinates(location.geometry.coordinates[0])
              const overallEmotion = getOverallEmotion(location._id)
              
              return (
                <React.Fragment key={location._id}>
                  <Polygon 
                    positions={convertedCoordinates}
                    pathOptions={{ 
                      color: emotionColors[overallEmotion],
                      fillColor: emotionColors[overallEmotion],
                      fillOpacity: 0.2
                    }}
                    eventHandlers={{
                      click: (e) => {
                        if (viewMode === 'emotion') {
                          onEmotionLocation(location._id)
                        } else {
                          onReportLocation(e.latlng.lat, e.latlng.lng, location._id)
                        }
                      }
                    }}
                  >
                    <Popup>
                      <div>
                        <h3 className="font-bold">{location.name}</h3>
                        <p>Click to {viewMode === 'emotion' ? 'rate' : 'report an issue for'} this location</p>
                      </div>
                    </Popup>
                  </Polygon>
                </React.Fragment>
              )
            })}
            {reports.map((report) => (
              <Marker 
                key={report._id} 
                position={[report.coordinates[1], report.coordinates[0]]}
                icon={L.divIcon({
                  className: 'custom-icon',
                  html: `${issueIcons[report.issueType]}`,
                })}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">Report</h3>
                    <p>Issue: {report.issueType}</p>
                    <p>Description: {report.description}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {emotions.map((emotion) => {
              const location = locations.find(loc => loc._id === emotion.location)
              if (!location) return null
              const center = convertCoordinates(location.geometry.coordinates[0])[0]
              return (
                <CircleMarker 
                  key={emotion._id}
                  center={center}
                  radius={5}
                  fillColor={emotionColors[emotion.emotion]}
                  color={emotionColors[emotion.emotion]}
                  weight={1}
                  opacity={1}
                  fillOpacity={0.8}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">Emotion: {emotion.emotion}</h3>
                      <p>User Type: {emotion.userType}</p>
                      <p>{emotion.description}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default MapView

