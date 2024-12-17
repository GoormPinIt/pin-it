import React, { useState, useEffect } from 'react';

type MasonryLayoutProps = {
  images: string[];
};

const MasonryLayout = ({ images }: MasonryLayoutProps) => {
  const [columnCount, setColumnCount] = useState<number>(6);
  const gap = 20;

  const updateColumnCount = () => {
    const columnWidth = 224;
    const gapSize = gap;
    const newColumnCount = Math.floor(
      window.innerWidth / (columnWidth + gapSize)
    );
    setColumnCount(newColumnCount);
  };

  useEffect(() => {
    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  const getRandomHeight = (): number => {
    const heights = [200, 250, 300, 350, 400];
    return heights[Math.floor(Math.random() * heights.length)];
  };

  return (
    <div
      style={{
        columnCount: columnCount,
        columnGap: `${gap}px`,
      }}
    >
      {images.map((src: string, index: number) => (
        <img
          key={index}
          src={src}
          alt={`Image ${index + 1}`}
          style={{
            width: '100%',
            height: `${getRandomHeight()}px`,
            marginBottom: `${gap}px`,
            objectFit: 'cover',
            borderRadius: '1rem',
          }}
        />
      ))}
    </div>
  );
};

export default MasonryLayout;
