import React from 'react';
import { getSeasonMoods } from '../utils/memoryUtils';

interface FuguangMoodPickerProps {
  showMoodPicker: boolean;
  setShowMoodPicker: (show: boolean) => void;
  handleMoodSelect: (mood: any) => void;
}

const FuguangMoodPicker: React.FC<FuguangMoodPickerProps> = ({ 
  showMoodPicker, 
  setShowMoodPicker, 
  handleMoodSelect 
}) => {
  return (
    showMoodPicker && (
      <div className="fuguang-mood-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="fuguang-mood-backdrop" onClick={() => setShowMoodPicker(false)} />
        <div className="fuguang-mood-sheet animate-modal-content">
          <p className="fuguang-mood-title">此刻的心情</p>
          <div className="fuguang-mood-options">
            {getSeasonMoods().map(mood => (
              <button key={mood.id} onClick={(e) => { e.stopPropagation(); handleMoodSelect(mood); }} className="fuguang-mood-btn">
                <div className="fuguang-mood-circle" style={{ backgroundColor: mood.color, color: mood.inkColor }}>{mood.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default FuguangMoodPicker;