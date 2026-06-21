import React from 'react';

interface FuguangOptionsProps {
  showOptions: boolean;
  selectedOption: string | null;
  setShowOptions: (show: boolean) => void;
  setIsChecked: (checked: boolean) => void;
  setSelectedOption: (option: string | null) => void;
  handleOptionSelect: (option: string) => void;
}

const FuguangOptions: React.FC<FuguangOptionsProps> = ({
  showOptions,
  selectedOption,
  setShowOptions,
  setIsChecked,
  setSelectedOption,
  handleOptionSelect
}) => {
  return (
    showOptions && (
      <div className="fuguang-options-container">
        <div className="fuguang-options-background" onClick={() => { setShowOptions(false); setIsChecked(false); setSelectedOption(null); }} />
        <div className="fuguang-options animate-modal-content">
          <button
            className={`fuguang-option ${selectedOption === 'photo' ? 'selected' : ''}`}
            onClick={(e) => { e.stopPropagation(); handleOptionSelect('photo'); }}
          >
            <div className="fuguang-option-icon">📷</div>
            <div className="fuguang-option-text">拍照</div>
          </button>
          <button
            className={`fuguang-option ${selectedOption === 'text' ? 'selected' : ''}`}
            onClick={(e) => { e.stopPropagation(); handleOptionSelect('text'); }}
          >
            <div className="fuguang-option-icon">✏️</div>
            <div className="fuguang-option-text">文字</div>
          </button>
          <button
            className={`fuguang-option ${selectedOption === 'mood' ? 'selected' : ''}`}
            onClick={(e) => { e.stopPropagation(); handleOptionSelect('mood'); }}
          >
            <div className="fuguang-option-icon">🎨</div>
            <div className="fuguang-option-text">心情</div>
          </button>
        </div>
      </div>
    )
  );
};

export default FuguangOptions;