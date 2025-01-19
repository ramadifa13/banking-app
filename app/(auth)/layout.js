import React from 'react';

const layout = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default layout;
