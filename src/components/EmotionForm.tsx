'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Location, Emotion } from '../types'
import { Laugh,Smile, Meh, Frown, AlertTriangle } from 'lucide-react'

interface EmotionFormProps {
  locations: Location[];
  onEmotionSubmitted: () => void;
  selectedLocationId: string | null;
}

interface FormData {
  emotion: Emotion['emotion'];
  userType: string;
  description: string;
}

const emotionIcons: Record<Emotion['emotion'], React.ReactNode> = {
  'good!': <Laugh className="w-4 h-4" />,
  'okay!': <Smile className="w-4 h-4" />,
  neutral: <Meh className="w-4 h-4" />,
  uneasy: <Frown className="w-4 h-4" />,
  unsafe: <AlertTriangle className="w-4 h-4" />
}

const emotionColors: Record<Emotion['emotion'], string> = {
  'good!': '#4CAF50', // Green
  'okay!': '#FFEB3B', // Yellow
  neutral: '#9E9E9E', // Grey
  uneasy: '#FF9800', // Orange
  unsafe: '#F44336' // Red
}

const EmotionForm: React.FC<EmotionFormProps> = ({ locations, onEmotionSubmitted, selectedLocationId }) => {
  const [formData, setFormData] = useState<FormData>({
    emotion: 'neutral',
    userType: 'general_public',
    description: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedLocationId) {
      alert('Please select a location on the map')
      return
    }
    try {
      const response = await fetch('http://localhost:5000/api/emotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData, locationId: selectedLocationId}),
      })
      if (response.ok) {
        onEmotionSubmitted()
        // Reset form
        setFormData({
          emotion: 'neutral',
          userType: 'general_public',
          description: '',
        })
      } else {
        console.error('Failed to submit emotion')
      }
    } catch (error) {
      console.error('Error submitting emotion:', error)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">How do you feel about this location?</label>
            <div className="flex space-x-4">
              {(Object.keys(emotionColors) as Emotion['emotion'][]).map((emotion) => (
                <button
                  key={emotion}
                  type="button"
                  className={`p-2 rounded-lg flex flex-col items-center ${formData.emotion === emotion ? 'ring-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: emotionColors[emotion] }}
                  onClick={() => setFormData(prevData => ({ ...prevData, emotion }))}
                >
                  {emotionIcons[emotion]}
                  <span className="mt-1 text-xs">{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">I am a:</label>
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
            <label className="block text-sm font-medium mb-2">Description (optional):</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              rows={3}
              placeholder="Provide additional details about your emotion"
            ></textarea>
          </div>

          {selectedLocationId && (
            <div>
              <label className="block text-sm font-medium mb-2">Selected Location:</label>
              <p>{locations.find(loc => loc._id === selectedLocationId)?.name || 'Unknown'}</p>
            </div>
          )}

          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg">
            Submit Emotion
          </button>
        </form>
      </CardContent>
    </Card>
  )
}

export default EmotionForm

