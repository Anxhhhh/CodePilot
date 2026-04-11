import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import ActivityBar from './components/ActivityBar/ActivityBar';
import Sidebar from './components/Sidebar/Sidebar';
import Editor from './components/Editor/Editor';
import ChatPanel from './components/Chat/ChatPanel';

function App() {
  const [activeFile, setActiveFile] = useState(null);

  return (
    <Layout>
      <ActivityBar />
      <Sidebar onFileSelect={setActiveFile} activeFile={activeFile} />
      <Editor activeFile={activeFile} />
      <ChatPanel />
    </Layout>
  );
}

export default App;
