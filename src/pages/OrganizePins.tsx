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
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import SortableItem from '../components/SortableItem';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { FaTrash } from 'react-icons/fa';

type PinData = {
  id: string;
  imageUrl: string;
  title?: string;
};

const OrganizePins: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [pins, setPins] = useState<PinData[]>([]);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

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

          // Fetch pin data from "pins" collection
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
    if (!selectedPinId) return;

    try {
      // 보드의 pins 배열에서 ID 제거
      const boardRef = doc(db, 'boards', boardId!);
      await updateDoc(boardRef, {
        pins: arrayRemove(selectedPinId),
      });

      // 상태 업데이트
      setPins((prevPins) => prevPins.filter((pin) => pin.id !== selectedPinId));
      setSelectedPinId(null);
      console.log(`핀 ${selectedPinId}이(가) 보드에서 제거되었습니다.`);
    } catch (error) {
      console.error('핀 제거 중 오류 발생:', error);
      alert('핀 제거 중 문제가 발생했습니다.');
    }
  };

  const handleSave = () => {
    console.log('저장된 핀 목록:', pins);
    alert('핀 정리가 저장되었습니다!');
    navigate(`/board/${boardId}`);
  };

  return (
    <div className="w-full h-screen p-4 flex flex-col ">
      <h2 className="text-xl font-bold mb-4 flex justify-center">
        핀 정리하기
      </h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pins.map((pin) => pin.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex flex-wrap justify-center space-x-4">
            {pins.map((pin) => (
              <SortableItem key={pin.id} id={pin.id}>
                <div
                  className={`relative group border-4 cursor-pointer ${
                    selectedPinId === pin.id
                      ? 'border-black'
                      : 'border-transparent'
                  } rounded-lg`}
                  onClick={() => {
                    console.log(`Pin clicked: ${pin.id}`);
                    setSelectedPinId(pin.id);
                  }}
                  style={{ width: '192px', height: '192px' }}
                >
                  <img
                    src={pin.imageUrl}
                    alt={pin.title || '핀'}
                    className="w-full h-full rounded-lg object-cover"
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
          disabled={!selectedPinId}
          className={`px-4 py-2 rounded text-white ${
            selectedPinId ? 'bg-red-500' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <FaTrash />
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default OrganizePins;
