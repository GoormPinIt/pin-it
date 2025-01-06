import React, { useState, useEffect, useRef } from 'react';
import SaveModalItem from './SaveModalItem';

interface SaveModalProps {
  onClose: () => void;
  items?: { icon?: string; title: string; buttonLabel?: string }[]; // `items`를 옵셔널로 설정
}

interface BoardItem {
  icon?: string;
  title: string;
  buttonLabel?: string;
}

const SaveModal: React.FC<SaveModalProps> = ({ onClose }) => {
  const [items, setItems] = useState<BoardItem[]>([]); // 서버에서 불러온 데이터를 저장
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 관리
  const modalRef = useRef<HTMLDivElement>(null);

  // 더미 데이터 가져오기

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // 모달 외부 클릭 시 닫기
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const fetchBoards = async () => {
      setIsLoading(true); // 로딩 시작
      try {
        // 서버 요청 시뮬레이션 (더미 데이터 사용)
        const response = await new Promise<BoardItem[]>((resolve) =>
          setTimeout(
            () =>
              resolve([
                {
                  icon: 'https://via.placeholder.com/30', // 아이콘 URL
                  title: '나의 보드',
                  buttonLabel: '저장',
                },
                {
                  icon: 'https://via.placeholder.com/30',
                  title: '포챠코',
                  buttonLabel: '저장',
                },
                {
                  icon: 'https://via.placeholder.com/30',
                  title: '폼폼푸린',
                  buttonLabel: '저장',
                },
                {
                  icon: 'https://via.placeholder.com/30',
                  title: '강아지',
                  buttonLabel: '저장',
                },
                {
                  icon: 'https://via.placeholder.com/30',
                  title: '고양이',
                  buttonLabel: '저장',
                },
              ]),
            // 1000, // 1초 지연
          ),
        );

        setItems(response); // 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching boards:', error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-md px-3 py-6 w-[350px]"
        ref={modalRef}
      >
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h2 className="text-lg font-semibold mb-4 text-center">저장</h2>

          {/* 검색 입력란 */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="검색"
              className="w-full border px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </div>

        {/* 리스트 */}
        <ul className="space-y-2 h-[300px] overflow-y-auto">
          {items.map((item, index) => (
            <SaveModalItem
              key={index}
              icon={item.icon}
              title={item.title}
              buttonLabel={item.buttonLabel}
              onClick={() => alert(`${item.title} 클릭됨`)}
            />
          ))}
        </ul>

        {/* 보드 생성 버튼 */}
        <div className="mt-4 modal-footer">
          <button
            className="flex items-center justify-center w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            onClick={() => alert('보드 만들기 클릭됨')}
          >
            <span className="font-semibold">+ 보드 만들기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;
