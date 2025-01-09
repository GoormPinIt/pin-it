import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Firebase 초기화 및 Firestore 설정 파일

interface TagDropdownProps {
  searchText: string;
  setTags: (value: string[]) => void;
  tags: string[];
}

interface Tag {
  id: string;
  name: string;
}

const TagDropdown: React.FC<TagDropdownProps> = ({
  searchText,
  setTags,
  tags,
}) => {
  const [data, setData] = useState<Tag[]>([]);

  async function fetchTags() {
    try {
      const tagsCollection = collection(db, 'tags'); // 'tags' 컬렉션 참조
      const querySnapshot = await getDocs(tagsCollection); // 모든 문서 가져오기

      const _data: Tag[] = querySnapshot.docs.map((doc) => ({
        id: doc.id, // 문서 ID
        name: doc.data().name, // 문서의 'name' 필드 값
      }));

      setData(_data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }

  useEffect(() => {
    console.log('현재 태그:', tags);
    fetchTags();
  }, []);

  const handleTagClick = (tagName: string) => {
    if (!tags.includes(tagName)) {
      const updatedTags = [...tags, tagName]; // 태그 중복 추가 방지
      setTags(updatedTags); // 상태 업데이트
      alert(`${updatedTags.join(', ')} 선택됨`); // 업데이트된 값 사용
    }
  };

  const filteredTags = searchText
    ? data.filter((tag) =>
        tag.name.toLowerCase().includes(searchText.toLowerCase()),
      )
    : data;

  return (
    <div className="absolute left-0 top-full mt-2 min-w-[400px] bg-white border border-gray-300 rounded-lg shadow-lg z-50">
      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {filteredTags.length > 0 ? (
          filteredTags.map((tag) => (
            <TagModelItem
              key={tag.id}
              name={tag.name}
              onClick={() => handleTagClick(tag.name)}
            />
          ))
        ) : (
          <li className="text-center text-gray-500">
            태그를 찾을 수 없습니다.
          </li>
        )}
      </ul>
    </div>
  );
};

interface TagModelItemProps {
  name: string; // 아이템 제목
  onClick: () => void; // 클릭 시 동작
}

const TagModelItem: React.FC<TagModelItemProps> = ({ name, onClick }) => {
  return (
    <li
      className="flex items-center justify-between hover:bg-gray-200 cursor-pointer px-2 py-2 group"
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className="font-semibold">{name}</span>
      </div>
    </li>
  );
};

export default TagDropdown;
