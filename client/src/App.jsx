import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import ActivityBar from './components/ActivityBar/ActivityBar';
import Sidebar from './components/Sidebar/Sidebar';
import Editor from './components/Editor/Editor';
import ChatPanel from './components/Chat/ChatPanel';
import AuthModal from './components/Auth/AuthModal';
import ProfileModal from './components/Auth/ProfileModal';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser, setLoading, setError } from './features/UserSlice';
import * as authService from './services/auth/auth.service';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();
  const [activeFile, setActiveFile] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [fileUpdateKey, setFileUpdateKey] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const response = await authService.getCurrentUser();
        if (response.success) {
          dispatch(setUser(response.data.user));
        }
      } catch (err) {
        console.error("Auto-login failed:", err);
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <AuthProvider>
      <Layout>
        <ActivityBar 
          onOpenAuth={() => setIsAuthModalOpen(true)} 
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />
        <Sidebar onFileSelect={setActiveFile} activeFile={activeFile} refreshKey={refreshKey} />
        <Editor activeFile={activeFile} fileUpdateKey={fileUpdateKey} />
        <ChatPanel 
          onFileSystemChange={() => setRefreshKey(k => k + 1)}
          onFileUpdated={(filename) => {
            if (filename === activeFile) setFileUpdateKey(k => k + 1);
          }}
        />
        
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
        <ProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
        />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f172a', // slate-900
              color: '#f8fafc',
              border: '1px solid #1e293b',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#8b5cf6', // accent violet
                secondary: '#f8fafc',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f8fafc',
              },
            },
          }}
        />
      </Layout>
    </AuthProvider>
  );
}

export default App;
