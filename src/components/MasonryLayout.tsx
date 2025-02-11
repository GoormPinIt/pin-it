import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type MasonryLayoutProps = {
  pins: { pinId: string; imageUrl: string }[];
};

const MasonryLayout = ({ pins }: MasonryLayoutProps) => {
  const [columnCount, setColumnCount] = useState<number>(6);
  const navigate = useNavigate();

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
      {pins.map((pin) => (
        <img
          key={pin.pinId}
          src={pin.imageUrl}
          alt={`Pin ${pin.pinId}`}
          onClick={() => navigate(`/pin/${pin.pinId}`)}
          style={{
            width: '100%',
            display: 'block',
            marginBottom: '16px',
            objectFit: 'cover',
            borderRadius: '1rem',
            cursor: 'pointer',
          }}
        />
      ))}
    </div>
  );
};

export default MasonryLayout;
