// frontend/src/components/layout/Layout.jsx
// frontend/src/components/layout/Layout.jsx
import React from 'react';
import NavBar from './NavBar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-black text-gray-100">
            <NavBar />
            <div>
                {children}
            </div>
        </div>
    );
};

export default Layout;