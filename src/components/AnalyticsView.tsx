import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const emotionColors = {
  'good!': '#4CAF50',
  'okay!': '#FFEB3B',
  neutral: '#9E9E9E',
  uneasy: '#FF9800',
  unsafe: '#F44336'
}

const issueColors = {
  broken_pavement: '#FF5722',
  missing_sidewalk: '#9C27B0',
  obstruction: '#3F51B5',
  no_ramps: '#00BCD4',
  poor_lighting: '#FFC107',
  others: '#607D8B'
}

export default function AnalyticsView({ locations, reports, emotions }) {
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [areaReport, setAreaReport] = useState(null)
  const [locationReport, setLocationReport] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [locationReportBreakdown, setLocationReportBreakdown] = useState(null)
  const [locationEmotionTrends, setLocationEmotionTrends] = useState(null)

  // Process emotions data for timeline
  const emotionsOverTime = useMemo(() => {
    if (!selectedArea || !emotions) return []
    
    // Group emotions by date
    const groupedByDate = emotions.reduce((acc, emotion) => {
      if (emotion.location?.area !== selectedArea) return acc
      
      const date = new Date(emotion.createdAt).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = {
          date,
          'good!': 0,
          'okay!': 0,
          neutral: 0,
          uneasy: 0,
          unsafe: 0
        }
      }
      acc[date][emotion.emotion]++
      return acc
    }, {})

    // Convert to array and sort by date
    return Object.values(groupedByDate).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    )
  }, [selectedArea, emotions])

  // Process reports data for timeline
  const issuesOverTime = useMemo(() => {
    if (!selectedArea || !reports) return []
    
    // Group reports by date
    const groupedByDate = reports.reduce((acc, report) => {
      if (report.location?.area !== selectedArea) return acc
      
      const date = new Date(report.createdAt).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = {
          date,
          broken_pavement: 0,
          missing_sidewalk: 0,
          obstruction: 0,
          no_ramps: 0,
          poor_lighting: 0,
          others: 0
        }
      }
      acc[date][report.issueType]++
      return acc
    }, {})

    // Convert to array and sort by date
    return Object.values(groupedByDate).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    )
  }, [selectedArea, reports])

  


  // Filter locations by selected area
  const locationsByArea = useMemo(() => {
    if (!selectedArea) return []
    return locations.filter(location => location.area === selectedArea)
  }, [selectedArea, locations])

  // Fetch area report when area is selected
  useEffect(() => {
    if (!selectedArea) return
    
    
    const fetchAreaReport = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:5000/api/analytics/detailed-report-area?area_name=${selectedArea}`)
        const data = await response.json()
        setAreaReport(data.report)
      } catch (error) {
        console.error('Error fetching area report:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAreaReport()
    if (!selectedLocation) return
    const fetchLocationReport = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:5000/api/analytics/detailed-report-location?location_id=${selectedLocation}`)
        const data = await response.json()
        setLocationReport(data.report)
      } catch (error) {
        console.error('Error fetching area report:', error)
      } finally {
        setIsLoading(false)
      }
    }
    const fetchLocationReportBreakdown = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:5000/api/analytics/location-reports?location_id=${selectedLocation}`)
        const data = await response.json()
        setLocationReportBreakdown(data.report)
        console.log("location report breakdown", data.report)
      } catch (error) {
        console.error('Error fetching area report:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchLocationEmotionTrends = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:5000/api/analytics/location-emotions?location_id=${selectedLocation}`)
        const data = await response.json()
        setLocationEmotionTrends(data.report)
        console.log("location emotion breakdown", data.report)

      } catch (error) {
        console.error('Error fetching area report:', error)
      } finally {
        setIsLoading(false)
      }
    }

    
    fetchLocationReport()
    fetchLocationReportBreakdown()
    fetchLocationEmotionTrends()
  }, [selectedArea, selectedLocation])

  // Area-level overview component
  const AreaOverview = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Area Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an area" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(new Set(locations.map(l => l.area))).map(area => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      

      {selectedArea && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Emotions Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emotionsOverTime}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.entries(emotionColors).map(([emotion, color]) => (
                      <Line
                        key={emotion}
                        type="monotone"
                        dataKey={emotion}
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Issues Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={issuesOverTime}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.entries(issueColors).map(([issue, color]) => (
                      <Line
                        key={issue}
                        type="monotone"
                        dataKey={issue}
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Area Report</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="prose">
                  {areaReport || 'No report available'}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Area Sentiment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(emotionColors).map(([emotion]) => ({
                        name: emotion,
                        value: emotions.filter(e => 
                          e.location?.area === selectedArea && 
                          e.emotion === emotion
                        ).length
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(emotionColors).map(([emotion, color]) => (
                        <Cell key={emotion} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Area Reports Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={Object.entries(issueColors).map(([issue]) => ({
                      name: issue,
                      value: reports.filter(r => 
                        r.location?.area === selectedArea && 
                        r.issueType === issue
                      ).length
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(issueColors).map(([issue, color]) => (
                      <Cell key={issue} fill={color} />
                    ))}
                  </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )

  // Location-specific view component
  const LocationView = () => (
    selectedArea && (
      <div className="space-y-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Location Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {locationsByArea.map(location => (
                  <SelectItem key={location._id} value={location._id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedLocation && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Location Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationReportBreakdown || []}
                        dataKey="count"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {locationReportBreakdown?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={issueColors[entry.type]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Sentiment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={locationEmotionTrends || []}
                      dataKey="count"
                      nameKey="emotion"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {locationEmotionTrends?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={emotionColors[entry.emotion]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
            <CardHeader>
              <CardTitle>Location Report</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="prose">
                  {locationReport || 'No report available'}
                </div>
              )}
            </CardContent>
          </Card>
          </>
        )}
      </div>
    )
  )

  return (
    <div className="space-y-8">
      <AreaOverview />
      <LocationView />
    </div>
  )
}