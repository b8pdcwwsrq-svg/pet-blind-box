import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getRandomDailyEvent } from '../utils/dailyEvents';
import { getCurrentPeriod } from '../utils/timeUtils';

interface FuguangOrbProps {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

const FuguangOrb: React.FC<FuguangOrbProps> = ({ isMusicPlaying, onToggleMusic }) => {
  const [currentEvent, setCurrentEvent] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const orbRef = useRef<HTMLDivElement>(null);
  
  // 根据时间段自动随机显示小事
  useEffect(() => {
    const period = getCurrentPeriod();
    const event = getRandomDailyEvent(period);
    setCurrentEvent(event);
    
    // 每5分钟更新一次事件
    const interval = setInterval(() => {
      const newEvent = getRandomDailyEvent(period);
      setCurrentEvent(newEvent);
      setIsAnimating(true);
      
      // 动画结束后重置状态
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }, 300000); // 5分钟 = 300000毫秒
    
    return () => clearInterval(interval);
  }, []);
  
  // 处理点击事件（如果需要的话）
  const handleOrbClick = useCallback(() => {
    // 如果需要点击功能，可以在这里添加
  }, []);
  
  return (
    <div className="fuguang-orb-container">
      <button 
        className={`fuguang-music-btn ${isMusicPlaying ? 'playing' : ''}`} 
        onClick={(e) => { e.stopPropagation(); onToggleMusic(); }}
      >
        {isMusicPlaying ? '♪' : '♫'}
      </button>
      
      <div 
        ref={orbRef}
        className={`fuguang-orb ${isAnimating ? 'pulse' : ''}`}
        onClick={handleOrbClick}
      >
        <div className="fuguang-orb-light" />
      </div>
      
      <div className="fuguang-orb-text">{currentEvent}</div>
    </div>
  );
};

export default FuguangOrb;