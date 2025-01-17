'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import dynamic from 'next/dynamic'
import ReportForm from './ReportForm'
import EmotionForm from './EmotionForm'
import AnalyticsView from './AnalyticsView'
import { Location, Report, Emotion } from '../types'

const MapView = dynamic(() => import('./MapView'), { ssr: false })

const SidewalkReporter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'analytics'>('map')
  const [locations, setLocations] = useState<Location[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [selectedArea, setSelectedArea] = useState<string>('all')
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null)
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false)

  useEffect(() => {
    fetchLocations()
    fetchReports()
    fetchEmotions()
  }, [])

  const fetchLocations = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/locations')
      const data: Location[] = await response.json()
      setLocations(data)
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  const fetchReports = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/reports')
      const data: Report[] = await response.json()
      setReports(data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  const fetchEmotions = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/emotions')
      const data: Emotion[] = await response.json()
      setEmotions(data)
    } catch (error) {
      console.error('Error fetching emotions:', error)
    }
  }

  const handleReportLocation = (lat: number, lng: number, locationId: string) => {
    setSelectedCoordinates([lng, lat])
    setSelectedLocationId(locationId)
    setIsReportModalOpen(true)
  }

  const handleEmotionLocation = (locationId: string) => {
    setSelectedLocationId(locationId)
    setIsEmotionModalOpen(true)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Sidewalk Reporter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === 'map' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('map')}
            >
              View Map
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === 'analytics' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </div>

          {activeTab === 'map' && (
            <MapView 
              locations={locations} 
              reports={reports} 
              emotions={emotions} 
              selectedArea={selectedArea} 
              setSelectedArea={setSelectedArea}
              onReportLocation={handleReportLocation}
              onEmotionLocation={handleEmotionLocation}
            />
          )}
          {activeTab === 'analytics' && <AnalyticsView locations={locations} reports={reports} emotions={emotions} />}
        </CardContent>
      </Card>

      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Issue</DialogTitle>
          </DialogHeader>
          <ReportForm 
            locations={locations} 
            onReportSubmitted={() => {
              fetchReports()
              setIsReportModalOpen(false)
            }} 
            selectedCoordinates={selectedCoordinates}
            selectedLocationId={selectedLocationId}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEmotionModalOpen} onOpenChange={setIsEmotionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Emotion</DialogTitle>
          </DialogHeader>
          <EmotionForm 
            locations={locations} 
            onEmotionSubmitted={() => {
              fetchEmotions()
              setIsEmotionModalOpen(false)
            }} 
            selectedLocationId={selectedLocationId}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SidewalkReporter

