import React from 'react';

type GridBoardProps = {
  images: string[];
};

const GridBoard = ({ images }: GridBoardProps): JSX.Element => {
  const filledImages =
    images.length < 3
      ? [...images, ...Array(3 - images.length).fill(null)]
      : images.slice(0, 3);

  return (
    <div className="grid grid-rows-2 grid-cols-3 gap-1 w-full h-40 rounded-2xl overflow-hidden">
      {filledImages
        .slice(0, 3)
        .map((src, index) =>
          src ? (
            <img
              key={index}
              src={src}
              alt={`핀${index + 1}`}
              className={`${
                index === 0 ? 'row-span-2 col-span-2' : 'row-span-1 col-span-1'
              } w-full h-full object-cover`}
            />
          ) : (
            <div
              key={index}
              className={`${
                index === 0 ? 'row-span-2 col-span-2' : 'row-span-1 col-span-1'
              } w-full h-full bg-gray-200`}
            />
          ),
        )}
    </div>
  );
};

export default GridBoard;
