import React from 'react';
import { getGanZhiDate } from '../utils/dateUtils';

interface FuguangHeaderProps {
  date: string;
}

const FuguangHeader: React.FC<FuguangHeaderProps> = () => {
  return (
    <div className="fuguang-header">
      <p className="fuguang-ganzhi">{getGanZhiDate()}</p>
      <h1 className="fuguang-title">今日拾光</h1>
    </div>
  );
};

export default FuguangHeader;