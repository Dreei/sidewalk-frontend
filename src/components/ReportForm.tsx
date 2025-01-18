"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Location } from "../types";

interface ReportFormProps {
  locations: Location[];
  onReportSubmitted: (certificateNumber: string) => void;
  selectedCoordinates: [number, number] | null;
  selectedLocationId: string | null;
}

interface FormData {
  userType: string;
  issueType: string;
  description: string;
  coordinates: [number, number] | null;
  locationId: string | null;
}

const ReportForm: React.FC<ReportFormProps> = ({
  locations,
  onReportSubmitted,
  selectedCoordinates,
  selectedLocationId,
}) => {
  const [formData, setFormData] = useState<FormData>({
    userType: "general_public",
    issueType: "broken_pavement",
    description: "",
    coordinates: null,
    locationId: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCoordinates || !selectedLocationId) {
      alert("Please select a location on the map");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          coordinates: selectedCoordinates,
          locationId: selectedLocationId,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        onReportSubmitted(data.certificateNumber);
        // Reset form
        setFormData({
          userType: "general_public",
          issueType: "broken_pavement",
          description: "",
          coordinates: null,
          locationId: null,
        });
      } else {
        console.error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  const selectedLocation = locations.find(
    (loc) => loc._id === selectedLocationId
  );

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 mt-4">
              I am a:
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="general_public">General Public</option>
              <option value="elderly">Elderly</option>
              <option value="pwd">Person with Disability</option>
              <option value="bike_user">Bike User</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Issue Type:
            </label>
            <select
              name="issueType"
              value={formData.issueType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="broken_pavement">Broken Pavement</option>
              <option value="missing_sidewalk">Missing Sidewalk</option>
              <option value="obstruction">Obstruction</option>
              <option value="no_ramps">No Ramps</option>
              <option value="poor_lighting">Poor Lighting</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description:
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              rows={3}
              placeholder="Provide additional details about the issue"
            ></textarea>
          </div>

          {selectedCoordinates && selectedLocation && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Selected Location:
              </label>
              <p>Location: {selectedLocation.name}</p>
              <p>
                Coordinates: {selectedCoordinates[1].toFixed(6)},{" "}
                {selectedCoordinates[0].toFixed(6)}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg"
          >
            Submit Report
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportForm;

