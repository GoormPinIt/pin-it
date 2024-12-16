import React from 'react';

type GridBoardProps = {
  images: string[];
};

const GridBoard = ({ images }: GridBoardProps): JSX.Element => (
  <div className="grid grid-rows-2 grid-cols-3 gap-1 w-full h-40 rounded-2xl overflow-hidden">
    {images.slice(0, 3).map((src, index) => (
      <img
        key={index}
        src={src}
        alt={`핀${index + 1}`}
        className={`${
          index === 0 ? 'row-span-2 col-span-2' : 'row-span-1 col-span-1'
        } w-full h-full object-cover`}
      />
    ))}
  </div>
);

export default GridBoard;
