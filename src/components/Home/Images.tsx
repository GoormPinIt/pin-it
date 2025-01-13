import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Message = {
  text: string;
  color: string;
  img: string[];
  id: number;
  bgColor: string;
};
interface ImagesProps {
  messages: Message[]; // Message 배열을 받도록 수정
  activeIndex: number;
}
const Images: React.FC<ImagesProps> = ({ messages, activeIndex }) => {
  const currentImages = messages[activeIndex]?.img || [];
  return (
    <motion.div
      className="columns-1 sm:columns-2 md:columns-3 lg:columns-6 gap-4 p-10"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2,
          },
        },
      }}
      key={activeIndex}
    >
      {currentImages.map((img, imgIdx) => (
        <motion.div
          key={`${activeIndex}-${imgIdx}`}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
              },
            },
          }}
          className="mb-4"
        >
          <motion.img
            className="break-inside-avoid w-60 h-80 rounded-lg mx-4 bg-contain"
            src={img}
            alt={`${messages[activeIndex].text} ${imgIdx + 1}`}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Images;
