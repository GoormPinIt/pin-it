import React from 'react'
import Pin from './Pin';

const images = [
    'https://dummyimage.com/480x400/ddd/222',
    'https://dummyimage.com/480x250/ddd/222',
    'https://dummyimage.com/480x640/ddd/222',
    'https://dummyimage.com/480x400/ddd/222',
    'https://dummyimage.com/480x480/ddd/222',
    'https://dummyimage.com/480x400/ddd/222',
    'https://dummyimage.com/480x520/ddd/222',
    'https://dummyimage.com/480x400/ddd/222',
    'https://dummyimage.com/480x400/ddd/222',
    'https://dummyimage.com/480x250/ddd/222',
    'https://dummyimage.com/480x400/ddd/222',
    'https://dummyimage.com/480x690/ddd/222',
    'https://dummyimage.com/480x400/ddd/222',
    'https://dummyimage.com/480x250/ddd/222',
    'https://dummyimage.com/480x640/ddd/222',
    'https://dummyimage.com/480x400/ddd/222',
    'https://dummyimage.com/480x480/ddd/222',
    'https://dummyimage.com/480x400/ddd/222',
    'https://dummyimage.com/480x520/ddd/222',
    'https://dummyimage.com/480x400/ddd/222',
    'https://dummyimage.com/480x400/ddd/222',
    'https://dummyimage.com/480x250/ddd/222',
    'https://dummyimage.com/480x400/ddd/222',
    'https://dummyimage.com/480x690/ddd/222',
];
const PinterestLayout = () => {
  return (
    <div className='columns-1 sm:columns-3 lg:columns-5 py-10 md:py-20 gap-4 px-2'>
        {images.map((src, index)=>(
            <div key={index} className="mb-4 break-inside-avoid">
                <Pin src={src}/>
            </div>
        ))}
    </div>
  )
}

export default PinterestLayout
