import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen w-screen bg-midnight overflow-hidden text-slate-200">
      {children}
    </div>
  );
};

export default Layout;
