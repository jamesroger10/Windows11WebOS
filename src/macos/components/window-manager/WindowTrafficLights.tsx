import React, { useState } from 'react';

interface WindowTrafficLightsProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized?: boolean;
}

export const WindowTrafficLights: React.FC<WindowTrafficLightsProps> = ({
  onClose,
  onMinimize,
  onMaximize,
  isMaximized = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-2 pl-3 py-2 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Red: Close */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="mac-traffic-btn mac-traffic-close group"
        title="Close"
      >
        <span
          className={`text-[8px] font-bold text-[#4c0002] transition-opacity leading-none ${
            isHovered ? 'opacity-90' : 'opacity-0'
          }`}
        >
          ×
        </span>
      </button>

      {/* Yellow: Minimize */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMinimize();
        }}
        className="mac-traffic-btn mac-traffic-minimize group"
        title="Minimize"
      >
        <span
          className={`text-[9px] font-bold text-[#5c3c00] transition-opacity leading-none -translate-y-0.5 ${
            isHovered ? 'opacity-90' : 'opacity-0'
          }`}
        >
          –
        </span>
      </button>

      {/* Green: Fullscreen / Maximize */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMaximize();
        }}
        className="mac-traffic-btn mac-traffic-maximize group"
        title={isMaximized ? 'Restore' : 'Zoom'}
      >
        <span
          className={`text-[7px] font-bold text-[#004d11] transition-opacity leading-none ${
            isHovered ? 'opacity-90' : 'opacity-0'
          }`}
        >
          {isMaximized ? '⤡' : '+'}
        </span>
      </button>
    </div>
  );
};
