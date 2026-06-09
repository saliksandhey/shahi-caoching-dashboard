import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Exports, Settings } from './pages/OtherPages';
import { Login } from './pages/Login';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

function App() {
  const fetchStudents = useStore((state) => state.fetchStudents);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchStudents();
    }
  }, [session, fetchStudents]);

  if (isLoading) {
    return (
      <div className="loader-spinner" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#c084fc' }}>
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

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
