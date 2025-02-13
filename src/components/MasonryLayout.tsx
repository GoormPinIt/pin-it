import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type MasonryLayoutProps = {
  pins: React.ReactNode[]; // ReactNode로 수정
};

const MasonryLayout = ({ pins }: MasonryLayoutProps) => {
  const [columnCount, setColumnCount] = useState<number>(6);

  const updateColumnCount = () => {
    const columnWidth = 224;
    const gap = 20;
    const newColumnCount = Math.floor(window.innerWidth / (columnWidth + gap));
    setColumnCount(newColumnCount);
  };

  useEffect(() => {
    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  return (
    <div
      style={{
        columnCount: columnCount,
        columnGap: '16px',
      }}
    >
      {pins.map((pin, index) => (
        <React.Fragment key={index}>{pin}</React.Fragment>
      ))}
    </div>
  );
};

export default MasonryLayout;
