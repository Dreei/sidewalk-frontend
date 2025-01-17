'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import ReportForm from './ReportForm';
import EmotionForm from './EmotionForm';
import AnalyticsView from './AnalyticsView';
import { Location, Report, Emotion } from '../types';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

const SidewalkReporter = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'analytics'>('map');
  const [locations, setLocations] = useState<Location[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<'report' | 'emotion'>('report');

  useEffect(() => {
    fetchLocations();
    fetchReports();
    fetchEmotions();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/locations');
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchEmotions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/emotions');
      const data = await response.json();
      setEmotions(data);
    } catch (error) {
      console.error('Error fetching emotions:', error);
    }
  };

  const handleReportLocation = (lat: number, lng: number, locationId: string) => {
    setSelectedCoordinates([lng, lat]);
    setSelectedLocationId(locationId);
    setModalView('report');
    setIsModalOpen(true);
  };

  const handleEmotionLocation = (locationId: string) => {
    setSelectedLocationId(locationId);
    setModalView('emotion');
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen bg-gray-100">
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <button
          className={`px-4 py-2 rounded-lg shadow-md ${
            activeTab === 'map' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
          }`}
          onClick={() => setActiveTab('map')}
        >
          Map View
        </button>
        <button
          className={`px-4 py-2 rounded-lg shadow-md ${
            activeTab === 'analytics' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
          }`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="h-full">
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
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {modalView === 'report' ? 'Report Sidewalk Issue' : 'Share Your Experience'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex space-x-2 mb-4 border-b pb-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                modalView === 'report' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setModalView('report')}
            >
              Report Issue
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                modalView === 'emotion' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setModalView('emotion')}
            >
              Share Emotion
            </button>
          </div>
          
          {modalView === 'report' ? (
            <ReportForm
              locations={locations}
              onReportSubmitted={() => {
                fetchReports();
                setIsModalOpen(false);
              }}
              selectedCoordinates={selectedCoordinates}
              selectedLocationId={selectedLocationId}
            />
          ) : (
            <EmotionForm
              locations={locations}
              onEmotionSubmitted={() => {
                fetchEmotions();
                setIsModalOpen(false);
              }}
              selectedLocationId={selectedLocationId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SidewalkReporter;