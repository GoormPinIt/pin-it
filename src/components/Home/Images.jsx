import React from 'react'

const Images = () => {
    return (
        <div>
          <MasonryLayout/>
        </div>
      )
}

export default Images

const MasonryLayout = () => {
    return (
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-6 gap-4 p-4">
        {/* {images.map((src, index) => (
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
  
