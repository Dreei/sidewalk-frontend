"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import ReportForm from "./ReportForm";
import EmotionForm from "./EmotionForm";
import AnalyticsView from "./AnalyticsView";
import { Location, Report, Emotion } from "../types";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

const SidewalkReporter = () => {
  const [activeTab, setActiveTab] = useState<"map" | "analytics">("map");
  const [locations, setLocations] = useState<Location[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<"report" | "emotion">("report");

  useEffect(() => {
    fetchLocations();
    fetchReports();
    fetchEmotions();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/locations");
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reports");
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchEmotions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/emotions");
      const data = await response.json();
      setEmotions(data);
    } catch (error) {
      console.error("Error fetching emotions:", error);
    }
  };

  const handleReportLocation = (
    lat: number,
    lng: number,
    locationId: string
  ) => {
    setSelectedCoordinates([lng, lat]);
    setSelectedLocationId(locationId);
    setModalView("report");
    setIsModalOpen(true);
  };

  const handleEmotionLocation = (locationId: string) => {
    setSelectedLocationId(locationId);
    setModalView("emotion");
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation tabs - responsive layout */}
      <div className="fixed top-0 left-0 right-0 z-10 p-2 sm:absolute sm:top-4 sm:left-4 sm:right-auto">
        <div className="flex justify-center space-x-2 sm:justify-start">
          <button
            className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 rounded-lg shadow-md transition-colors ${
              activeTab === "map"
                ? "bg-blue-500 text-white"
                : "bg-gray-50 text-gray-800"
            }`}
            onClick={() => setActiveTab("map")}
          >
            Map View
          </button>
          <button
            className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 rounded-lg shadow-md transition-colors ${
              activeTab === "analytics"
                ? "bg-blue-500 text-white"
                : "bg-gray-50 text-gray-800"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Main content area - adjusted for fixed header */}
      <div className="h-[calc(100vh-3rem)] pt-12 sm:h-screen sm:pt-0">
        {activeTab === "map" && (
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
        {activeTab === "analytics" && (
          <div className="h-full overflow-auto">
            <AnalyticsView
              locations={locations}
              reports={reports}
              emotions={emotions}
            />
          </div>
        )}
      </div>

      {/* Modal - responsive design */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {modalView === "report"
                ? "Report Sidewalk Issue"
                : "Share Your Experience"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 mb-4 border-b pb-4">
            <button
              className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 rounded-lg transition-colors ${
                modalView === "report"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setModalView("report")}
            >
              Report Issue
            </button>
            <button
              className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 rounded-lg transition-colors ${
                modalView === "emotion"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setModalView("emotion")}
            >
              Share Emotion
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {modalView === "report" ? (
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SidewalkReporter;
