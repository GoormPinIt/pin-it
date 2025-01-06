import React from 'react';

// interface ImagesProps {}

const Images: React.FC = () => {
  return (
    <div>
      <MasonryLayout />
    </div>
  );
};

export default Images;

const MasonryLayout: React.FC = () => {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-6 gap-4 p-10">
      {/* If you plan to use dynamic data, uncomment the map function and ensure images is defined */}
      {/* {images.map((src: string, index: number) => (
        <div key={index} className="mb-4 break-inside-avoid">
          <img src={src} alt={`masonry-${index}`} className="w-full rounded-lg" />
        </div>
      ))} */}
      <p className="break-inside-avoid w-60 h-80 rounded-lg bg-slate-400 mx-4"></p>
      <p className="break-inside-avoid w-60 h-80 rounded-lg bg-slate-400 mx- mt-3"></p>
      <p className="break-inside-avoid w-60 h-80 rounded-lg bg-slate-400 mx-4"></p>
      <p className="break-inside-avoid w-60 h-80 rounded-lg bg-slate-400 mx-4"></p>
      <p className="break-inside-avoid w-60 h-80 rounded-lg bg-slate-400 mx-4"></p>
      <p className="break-inside-avoid w-60 h-80 rounded-lg bg-slate-400 mx-4"></p>
    </div>
  );
};
