import React, { useState, useEffect } from 'react';

type MasonryLayoutProps = {
  images: string[];
};

const MasonryLayout = ({ images }: MasonryLayoutProps) => {
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
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Image ${index + 1}`}
          style={{
            width: '100%',
            display: 'block',
            marginBottom: '16px',
            objectFit: 'cover',
            borderRadius: '1rem',
          }}
        />
      ))}
    </div>
  );
};

export default MasonryLayout;
