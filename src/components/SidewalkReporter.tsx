"use client";
import React, { useState, useEffect } from "react";
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
import ChatPopup from "./ui/popup";

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

  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleFabClick = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation tabs - responsive layout */}
      <div className="fixed top-0 left-0 right-0 z-10 px-4 sm:absolute sm:left-4 sm:right-4">
        <div className="flex justify-between items-center py-4 md:py-8">
          <div className="flex space-x-4">
            <button
              className={`text-sm px-4 py-2 lg:px-3 lg:text-lg rounded-lg shadow-md transition-colors ${
                activeTab === "map"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-50 text-gray-800"
              }`}
              onClick={() => setActiveTab("map")}
            >
              Map View
            </button>
            <button
              className={`text-sm px-4 py-2 lg:px-3 lg:text-lg rounded-lg shadow-md transition-colors ${
                activeTab === "analytics"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-50 text-gray-800"
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              Analytics
            </button>
          </div>
          <img
            src="/landas.png"
            alt="landas"
            className="w-24 sm:w-32 md:w-40" // Tailwind classes for responsiveness
            style={{ maxWidth: "100%", height: "auto" }} // Ensure responsiveness without distortion
          />
          <img
            src="/acssist.png"
            alt="acssist"
            className="w-24 sm:w-32 md:w-40" // Tailwind classes for responsiveness
            style={{ maxWidth: "100%", height: "auto" }} // Ensure responsiveness without distortion
          />
        </div>
      </div>

      {/* Main content area - adjusted for fixed header */}
      <div className="h-[calc(99vh-3rem)]">
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
        {isChatOpen && <ChatPopup onClose={handleCloseChat} />}
        <button
          onClick={handleFabClick} // Add your custom handler here
          className="fixed bottom-4 left-4 z-50 flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <span className="material-icons">💬</span>{" "}
        </button>
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
