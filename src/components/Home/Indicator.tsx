import React from 'react';
interface IndicatorProps {
  activeIndex: number;
  total: number;
  messages: { bgColor: string }[];
}

const Indicator: React.FC<IndicatorProps> = ({
  activeIndex,
  total,
  messages,
}) => {
  return (
    <div className="flex w-44 justify-around">
      {Array.from({ length: total }).map((_, idx) => (
        <p
          key={idx}
          className={`w-3 my-5 h-3 rounded-full ${
            idx === activeIndex ? messages[idx].bgColor : 'bg-slate-400'
          }`}
        ></p>
      ))}
    </div>
  );
};

export default Indicator;
