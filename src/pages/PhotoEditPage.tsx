import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import { HiArrowUpCircle } from 'react-icons/hi2';
import { GrPaint } from 'react-icons/gr';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { LuEraser } from 'react-icons/lu';
import { IoText } from 'react-icons/io5';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { HiOutlineSave } from 'react-icons/hi';
import { PiPaintBrushBold } from 'react-icons/pi';

const PhotoEditPage = () => {
  const [imgBase64, setImgBase64] = useState<string>('');
  const [color, setColor] = useState<string>('#000000');
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [isFilling, setIsFilling] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isAddingPhoto, setIsAddingPhoto] = useState<boolean>(false);
  const [canvasState, setCanvasState] = useState<string | null>(null);
  const [isErasing, setIsErasing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && imgBase64) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.height / img.width;
          let drawWidth = CANVAS_WIDTH;
          let drawHeight = CANVAS_HEIGHT;

          if (CANVAS_WIDTH / CANVAS_HEIGHT > aspectRatio) {
            drawWidth = CANVAS_HEIGHT / aspectRatio;
          } else {
            drawHeight = CANVAS_WIDTH * aspectRatio;
          }

          const x = (CANVAS_WIDTH - drawWidth) / 2;
          const y = (CANVAS_HEIGHT - drawHeight) / 2;

          ctx.drawImage(img, x, y, drawWidth, drawHeight);
          setCanvasState(canvas.toDataURL());
        };
        img.src = imgBase64;
      }
    }
  }, [imgBase64]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setImgBase64(e.target.result);
          setCanvasState(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = e.target.value;
    }
  };

  const handleLineWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLineWidth = Number(e.target.value);
    setLineWidth(newLineWidth);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.lineWidth = newLineWidth;
    }
  };

  const handleModeToggle = () => {
    setIsFilling(!isFilling);
  };

  const handleCanvasClick = () => {
    if (isFilling) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      if (isErasing) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
      }
      ctx.lineWidth = lineWidth;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.globalCompositeOperation = 'source-over';
      setCanvasState(canvas.toDataURL());
    }
  };

  const handleClearCanvas = () => {
    setImgBase64('');
    setCanvasState(null);
  };

  const handleErase = () => {
    setColor('#FFFFFF');
  };

  const handleAddText = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && text) {
      ctx.font = '20px Arial';
      ctx.fillStyle = color;
      ctx.fillText(text, 50, 50);
    }
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
                <h2 className="text-base font-normal text-black max-w-[300px] text-center">
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
          <button onClick={handleModeToggle}>
            {isFilling ? <PiPaintBrushBold size={30} /> : <GrPaint size={30} />}
          </button>
          <button onClick={handleClearCanvas}>
            <RiDeleteBin5Line size={30} />
          </button>
          <button onClick={handleErase}>
            <LuEraser size={30} />
          </button>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
            className="w-36 px-4 py-2 border rounded"
          />
          <button onClick={handleAddText}>
            <IoText size={30} />
          </button>
          {/* <button>
            <MdOutlineAddPhotoAlternate size={30} />
          </button> */}
          <button onClick={handleSaveImage}>
            <HiOutlineSave size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditPage;
