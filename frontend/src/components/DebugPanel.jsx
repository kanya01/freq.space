import React from 'react';

const DebugPanel = ({ loading, error, data }) => {
    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg max-w-sm text-xs">
            <h3 className="font-bold mb-2">Debug Info</h3>
            <div>Loading: {loading ? 'Yes' : 'No'}</div>
            <div>Error: {error || 'None'}</div>
            <div>Data: {JSON.stringify(data, null, 2)}</div>
        </div>
    );
};

export default DebugPanel;