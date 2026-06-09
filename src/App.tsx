import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Exports, Settings } from './pages/OtherPages';
import { useStore } from './store/useStore';

function App() {
  const fetchStudents = useStore((state) => state.fetchStudents);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="exports" element={<Exports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
