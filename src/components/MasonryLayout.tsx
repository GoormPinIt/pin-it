import React, { useState, useEffect } from 'react';

type MasonryLayoutProps = {
  images: string[];
};

const MasonryLayout = ({ images }: MasonryLayoutProps) => {
  const [columnCount, setColumnCount] = useState<number>(6);
  const [heights] = useState<number[]>(() =>
    images.map(() => {
      const heights = [200, 250, 300, 350, 400];
      return heights[Math.floor(Math.random() * heights.length)];
    })
  );

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
            height: `${heights[index]}px`,
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
