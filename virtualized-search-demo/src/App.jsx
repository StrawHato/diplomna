import React, { useMemo, useState, Profiler } from 'react';
import './App.css';

import { generateFakeUsers } from './data/generateFakeUsers';
import { useDebounce } from './hooks/useDebounce';

import SearchInput from './components/SearchInput';
// import FullList from './components/FullList';
import VirtualizedList from './components/VirtualizedList';

// Функція зворотного виклику для React Profiler
const onRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
  interactions
) => {
  console.log(`[Profiler] ${id} (${phase})`);
  console.log(`⏱ actualDuration: ${actualDuration.toFixed(2)}ms`);
  console.log(`📦 baseDuration: ${baseDuration.toFixed(2)}ms`);
  console.log(`🕒 startTime: ${startTime.toFixed(2)}ms`);
  console.log(`✅ commitTime: ${commitTime.toFixed(2)}ms`);
  console.log(`🧩 interactions:`, interactions);
};

function App() {
  const allUsers = useMemo(() => generateFakeUsers(10000), []);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) =>
      user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm, allUsers]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔍 Пошук по великому списку користувачів</h1>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      
      <Profiler id="UserList" onRender={onRenderCallback}>
        <VirtualizedList data={filteredUsers} />
      </Profiler>

      {/* <Profiler id="UserList" onRender={onRenderCallback}>
        <FullList data={filteredUsers} />
      </Profiler> */}

    </div>
  );
}

export default App;
