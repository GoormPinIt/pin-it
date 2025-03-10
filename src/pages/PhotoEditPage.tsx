import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import { HiArrowUpCircle } from 'react-icons/hi2';
import { GrPaint } from 'react-icons/gr';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { LuEraser } from 'react-icons/lu';
import { IoText } from 'react-icons/io5';
import { HiOutlineSave } from 'react-icons/hi';
import { PiPaintBrushBold } from 'react-icons/pi';

type ToolMode = 'draw' | 'fill' | 'text';

const PhotoEditPage = () => {
  const [imgBase64, setImgBase64] = useState<string>('');
  const [color, setColor] = useState<string>('#000000');
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [text, setText] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<number>(20);
  const [mode, setMode] = useState<ToolMode>('draw');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && imgBase64) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        };
        img.src = imgBase64;
      }
    }
  }, [imgBase64]);

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setImgBase64(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleLineWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLineWidth(Number(e.target.value));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    if (mode === 'fill') {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else if (mode === 'text' && text) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      ctx.font = `${textSize}px Arial`;
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      setMode('draw');
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'draw') return;

    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || mode !== 'draw') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClearCanvas = () => {
    setImgBase64('');
  };

  const handleErase = () => {
    setColor('#FFFFFF');
  };

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'edited-image.png';
      link.click();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="flex w-full max-w-5xl p-8 bg-white rounded-2xl shadow-lg">
        <div>
          {!imgBase64 ? (
            <div className="w-[800px] h-[600px] bg-[#e9e9e9] rounded-lg border-2 border-gray-300 border-dashed relative overflow-hidden">
              <label className="absolute inset-0 flex flex-col justify-center items-center cursor-pointer text-gray-600 gap-4">
                <HiArrowUpCircle className="text-[60px] text-black" />
                <h2 className="text-xl font-normal text-black max-w-[300px] text-center">
                  파일을 선택하거나 여기로 끌어다 놓으세요.
                </h2>
                <input
                  ref={fileInputRef}
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleChangeFile}
                />
                <div className="absolute bottom-8 px-6 text-center text-gray-500 text-sm leading-snug">
                  20 MB 미만의 고화질 .jpg 파일 또는 200 MB 미만의 .mp4 파일을
                  사용하세요.
                </div>
              </label>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border border-gray-300"
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          )}
        </div>
        <div className="ml-8 flex flex-col space-y-4">
          <input type="color" value={color} onChange={handleColorChange} />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              선 굵기
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={lineWidth}
              onChange={handleLineWidthChange}
            />
          </div>
          <button onClick={() => setMode(mode === 'fill' ? 'draw' : 'fill')}>
            {mode === 'fill' ? (
              <PiPaintBrushBold size={30} />
            ) : (
              <GrPaint size={30} />
            )}
          </button>
          <button onClick={handleClearCanvas}>
            <RiDeleteBin5Line size={30} />
          </button>
          <button onClick={handleErase}>
            <LuEraser size={30} />
          </button>
          <label className="block text-sm font-medium text-gray-700">
            텍스트 크기
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={textSize}
            onChange={(e) => setTextSize(Number(e.target.value))}
          />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
            className="w-36 px-4 py-2 border rounded"
          />
          <button onClick={() => setMode('text')}>
            <IoText size={30} />
          </button>
          <button onClick={handleSaveImage}>
            <HiOutlineSave size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditPage;
