import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import SortableItem from '../components/SortableItem';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';

type PinData = {
  id: string;
  imageUrl: string;
  title?: string;
};

const OrganizePins: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [pins, setPins] = useState<PinData[]>([]);
  const [selectedPinIds, setSelectedPinIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPins = async () => {
      if (!boardId) {
        console.error('보드 ID가 없습니다.');
        navigate('/');
        return;
      }

      try {
        const boardRef = doc(db, 'boards', boardId);
        const boardSnap = await getDoc(boardRef);

        if (boardSnap.exists()) {
          const boardData = boardSnap.data();
          const pinIds = boardData?.pins || [];

          const pinPromises = pinIds.map(async (pinId: string) => {
            const pinRef = doc(db, 'pins', pinId);
            const pinSnap = await getDoc(pinRef);

            if (pinSnap.exists()) {
              return { id: pinSnap.id, ...pinSnap.data() } as PinData;
            }
            return null;
          });

          const pinsData = (await Promise.all(pinPromises)).filter(
            (pin): pin is PinData => pin !== null,
          );

          setPins(pinsData);
        } else {
          console.error('보드 데이터를 찾을 수 없습니다.');
          navigate('/');
        }
      } catch (error) {
        console.error('핀 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchPins();
  }, [boardId, navigate]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = pins.findIndex((pin) => pin.id === active.id);
    const newIndex = pins.findIndex((pin) => pin.id === over.id);

    setPins((prevPins) => arrayMove(prevPins, oldIndex, newIndex));
  };

  const handleDelete = async () => {
    if (selectedPinIds.size === 0) return;

    try {
      const boardRef = doc(db, 'boards', boardId!);
      const selectedPinIdsArray = Array.from(selectedPinIds);

      await updateDoc(boardRef, {
        pins: selectedPinIdsArray.reduce(
          (acc, pinId) => arrayRemove(pinId),
          {},
        ),
      });

      setPins((prevPins) =>
        prevPins.filter((pin) => !selectedPinIds.has(pin.id)),
      );
      setSelectedPinIds(new Set());
    } catch (error) {
      console.error('핀 제거 중 오류 발생:', error);
      alert('핀 제거 중 문제가 발생했습니다.');
    }
  };

  const handleSave = async () => {
    try {
      const boardRef = doc(db, 'boards', boardId!);

      const updatedPinIds = pins.map((pin) => pin.id);
      await updateDoc(boardRef, { pins: updatedPinIds });

      alert('핀 정리가 저장되었습니다!');
      navigate(`/board/${boardId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePinClick = (pinId: string) => {
    setSelectedPinIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pinId)) {
        newSet.delete(pinId);
      } else {
        newSet.add(pinId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedPinIds.size > 0) {
      setSelectedPinIds(new Set());
    } else {
      setSelectedPinIds(new Set(pins.map((pin) => pin.id)));
    }
  };

  return (
    <div className="w-full h-screen p-2 flex flex-col">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(`/board/${boardId}`)}
          className="text-gray-700 hover:text-black"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">선택 및 재정렬</h2>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-700 text-[10px]">
          더블 클릭하여 사진을 선택해주세요
        </span>
        <button
          onClick={handleSelectAll}
          className="px-2 py-1 bg-gray-200 text-xs rounded-3xl"
        >
          {selectedPinIds.size > 0 ? '모두 해제' : '모두 선택'}
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pins.map((pin) => pin.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-2">
            {pins.map((pin) => (
              <SortableItem key={pin.id} id={pin.id}>
                <div
                  className={`relative w-full group rounded-lg ${
                    selectedPinIds.has(pin.id)
                      ? 'border-2 border-black'
                      : 'border-2 border-transparent'
                  }`}
                  onClick={() => handlePinClick(pin.id)}
                  style={{
                    aspectRatio: '1 / 1', // 정사각형 유지
                    overflow: 'hidden', // 이미지 넘침 방지
                  }}
                >
                  <img
                    src={pin.imageUrl}
                    alt={pin.title || '핀'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-4 flex justify-center items-center space-x-4">
        <button
          onClick={handleDelete}
          disabled={selectedPinIds.size === 0}
          className={`px-4 py-2 rounded text-white ${
            selectedPinIds.size > 0
              ? 'bg-red-500'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <FaTrash />
        </button>
        <button
          onClick={handleSave}
          className="px-2 py-1 bg-gray-500 text-white rounded"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default OrganizePins;
