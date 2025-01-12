import { useState, useEffect } from 'react';
import { fetchBoards } from '../utils/boards';
import useCurrentUserUid from './useCurrentUserUid';
import { Board, BoardItem } from '../types';

const useSearchBoards = () => {
  const [uid, setUid] = useState(useCurrentUserUid());
  const [searchText, setSearchText] = useState('');
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    const loadBoards = async () => {
      if (!uid) return; // userId가 없을 경우 로직 실행 안 함
      const fetchedBoards = await fetchBoards(uid);
      setBoards(fetchedBoards);
    };

    loadBoards();
  }, [uid]);

  const filteredBoards = boards.filter((board) =>
    board.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  return {
    searchText,
    setSearchText,
    filteredBoards,
  };
};

export default useSearchBoards;
