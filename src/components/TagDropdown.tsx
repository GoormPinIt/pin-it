import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';

import { db } from '../firebase';

interface TagDropdownProps {
  searchText: string;
  setTags: (value: string[]) => void;
  setSearchText: (value: string) => void;
  tags: string[];
  onClose: () => void;
}

interface Tag {
  id: string;
  name: string;
}

const TagDropdown: React.FC<TagDropdownProps> = ({
  searchText,
  setTags,
  tags,
  setSearchText,
  onClose,
}) => {
  const [data, setData] = useState<Tag[]>([]);

  async function fetchTags() {
    try {
      const tagsCollection = collection(db, 'tags');
      const querySnapshot = await getDocs(tagsCollection);

      const _data: Tag[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));

      setData(_data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }

  useEffect(() => {
    fetchTags();
  }, []);

  const handleTagClick = (tagName: string) => {
    if (!tags.includes(tagName)) {
      const updatedTags = [...tags, tagName];
      setTags(updatedTags);
      console.log(`${tagName} 선택됨. 현재 태그:`, updatedTags);
    }
    // onClose();
  };

  const filteredTags = searchText
    ? data
        .filter((tag) => !tags.includes(tag.name)) // 이미 선택된 태그 제외
        .filter((tag) =>
          tag.name.toLowerCase().includes(searchText.toLowerCase()),
        )
    : [];

  if (!searchText) {
    return null; // searchText가 빈 문자열이면 드롭다운 숨기기
  }

  return (
    <>
      {filteredTags.length > 0 && (
        <div className="absolute left-0 top-full mt-2 min-w-[400px] bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {filteredTags.map((tag) => (
              <li
                key={tag.id}
                className="flex items-center justify-between hover:bg-gray-200 cursor-pointer px-2 py-2 group"
                onMouseDown={(e) => {
                  setSearchText('');
                  e.stopPropagation();
                  e.preventDefault();
                  handleTagClick(tag.name);
                }}
              >
                <span className="font-semibold">{tag.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default TagDropdown;
