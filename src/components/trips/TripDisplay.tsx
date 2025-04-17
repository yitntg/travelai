'use client';

import { Trip } from '@/lib/types';

interface TripDisplayProps {
  trip: Trip | null;
}

export default function TripDisplay({ trip }: TripDisplayProps) {
  if (!trip) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">您的行程将在这里显示</h3>
          <p className="text-gray-600">
            通过左侧聊天框告诉AI助手您的旅行计划，系统将自动生成定制化行程并在此展示。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">{trip.destination} 行程规划</h2>
        <p className="text-sm text-gray-500">
          {trip.duration} • {trip.travelType}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {trip.days.map((day, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-md font-medium bg-blue-50 p-2 rounded text-blue-800 mb-3">
              第{index + 1}天: {day.title}
            </h3>
            
            <div className="space-y-4">
              {day.activities.map((activity, actIndex) => (
                <div key={actIndex} className="border-l-2 border-blue-200 pl-4 pb-4">
                  <div className="flex items-start">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 flex-1">
                      <p className="font-medium text-gray-800 mb-1">{activity.time} - {activity.title}</p>
                      <p className="text-gray-600 text-sm">{activity.description}</p>
                      
                      {activity.location && (
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {activity.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {trip.notes && trip.notes.length > 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <h3 className="text-md font-medium text-yellow-800 mb-2">旅行提示与建议</h3>
            <ul className="space-y-2">
              {trip.notes.map((note, index) => (
                <li key={index} className="text-gray-700 text-sm flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          保存行程计划
        </button>
      </div>
    </div>
  );
} 