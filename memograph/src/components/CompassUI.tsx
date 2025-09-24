'use client';

import React from 'react';

interface CompassUIProps {
  heading: number;
  targetAngle: number;
  capturedAngles: number[];
  isAligned: boolean;
}

export const CompassUI: React.FC<CompassUIProps> = ({
  heading,
  targetAngle,
  capturedAngles,
  isAligned
}) => {
  const size = 200;
  const center = size / 2;
  const radius = 80;

  // Generate 12 target angles (0, 30, 60, ..., 330)
  const allAngles = Array.from({ length: 12 }, (_, i) => i * 30);

  const getAnglePosition = (angle: number) => {
    const radians = (angle - 90) * (Math.PI / 180); // -90 to start from top
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians)
    };
  };

  const getPointerPosition = () => {
    const radians = (heading - 90) * (Math.PI / 180);
    return {
      x: center + (radius - 20) * Math.cos(radians),
      y: center + (radius - 20) * Math.sin(radians)
    };
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative">
        <svg width={size} height={size} className="w-full h-auto">
          {/* Outer circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Inner circle */}
          <circle
            cx={center}
            cy={center}
            r={radius - 10}
            fill="none"
            stroke="#6B7280"
            strokeWidth="1"
          />
          
          {/* Center dot */}
          <circle
            cx={center}
            cy={center}
            r="4"
            fill="#374151"
          />
          
          {/* Angle markers */}
          {allAngles.map((angle, index) => {
            const isCaptured = capturedAngles.includes(angle);
            const isTarget = angle === targetAngle;
            const position = getAnglePosition(angle);
            
            return (
              <circle
                key={index}
                cx={position.x}
                cy={position.y}
                r={isTarget ? "8" : "4"}
                fill={
                  isCaptured ? "#10B981" : // Green for captured
                  isTarget ? "#F59E0B" : // Orange for target
                  "#9CA3AF" // Gray for others
                }
                className={isTarget ? "animate-pulse" : ""}
              />
            );
          })}
          
          {/* Direction pointer */}
          <g>
            <circle
              cx={center}
              cy={center}
              r="6"
              fill="#EF4444"
            />
            <line
              x1={center}
              y1={center}
              x2={getPointerPosition().x}
              y2={getPointerPosition().y}
              stroke="#EF4444"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              cx={getPointerPosition().x}
              cy={getPointerPosition().y}
              r="4"
              fill="#EF4444"
            />
          </g>
          
          {/* North indicator */}
          <text
            x={center}
            y={center - radius - 15}
            textAnchor="middle"
            className="text-xs font-bold fill-gray-600"
          >
            N
          </text>
        </svg>
        
        {/* Status indicator */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isAligned 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isAligned ? 'Aligned!' : 'Rotate to target'}
          </div>
        </div>
      </div>
      
      {/* Angle display */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-600">
          Current: {Math.round(heading)}°
        </div>
        <div className="text-sm text-gray-600">
          Target: {targetAngle}°
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Progress: {capturedAngles.length}/12
        </div>
      </div>
    </div>
  );
};
