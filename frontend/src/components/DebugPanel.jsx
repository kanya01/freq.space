import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

const DebugPanel = ({
                        loading,
                        error,
                        data,
                        networkRequests = [],
                        componentName = 'Component',
                        additionalInfo = {}
                    }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    // Only show in development
    if (process.env.NODE_ENV !== 'development' || !isVisible) return null;

    const formatData = (obj) => {
        if (obj === null || obj === undefined) return 'null';
        if (typeof obj === 'string') return obj;
        if (typeof obj === 'boolean') return obj.toString();
        if (typeof obj === 'number') return obj.toString();

        try {
            return JSON.stringify(obj, null, 2);
        } catch (e) {
            return 'Error serializing data: ' + e.message;
        }
    };

    const getDataSummary = (data) => {
        if (!data) return 'No data';
        if (Array.isArray(data)) return `Array (${data.length} items)`;
        if (typeof data === 'object') {
            const keys = Object.keys(data);
            return `Object (${keys.length} properties: ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''})`;
        }
        return typeof data;
    };

    return (
        <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 text-white rounded-lg shadow-2xl max-w-md z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-t-lg">
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : error ? 'bg-red-400' : 'bg-green-400'}`} />
                    <h3 className="font-semibold text-sm">{componentName} Debug</h3>
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 hover:bg-gray-700 rounded"
                    >
                        {isExpanded ?
                            <ChevronUpIcon className="w-4 h-4" /> :
                            <ChevronDownIcon className="w-4 h-4" />
                        }
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1 hover:bg-gray-700 rounded"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="p-3 text-xs max-h-96 overflow-y-auto">
                    {/* Status */}
                    <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-300">Status:</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                                loading ? 'bg-yellow-600 text-yellow-100' :
                                    error ? 'bg-red-600 text-red-100' :
                                        'bg-green-600 text-green-100'
                            }`}>
                                {loading ? 'Loading' : error ? 'Error' : 'Ready'}
                            </span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-3">
                            <div className="font-medium text-red-300 mb-1">Error:</div>
                            <div className="bg-red-900/20 border border-red-700 rounded p-2 text-red-200">
                                {formatData(error)}
                            </div>
                        </div>
                    )}

                    {/* Data Summary */}
                    <div className="mb-3">
                        <div className="font-medium text-gray-300 mb-1">Data Summary:</div>
                        <div className="text-gray-400">{getDataSummary(data)}</div>
                    </div>

                    {/* Network Requests */}
                    {networkRequests.length > 0 && (
                        <div className="mb-3">
                            <div className="font-medium text-gray-300 mb-1">Recent API Calls:</div>
                            {networkRequests.slice(-3).map((req, index) => (
                                <div key={index} className="bg-gray-800 rounded p-2 mb-1">
                                    <div className="flex justify-between">
                                        <span className="text-blue-300">{req.method} {req.url}</span>
                                        <span className={`text-xs ${req.status >= 400 ? 'text-red-400' : 'text-green-400'}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    {req.error && (
                                        <div className="text-red-400 text-xs mt-1">{req.error}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Additional Info */}
                    {Object.keys(additionalInfo).length > 0 && (
                        <div className="mb-3">
                            <div className="font-medium text-gray-300 mb-1">Additional Info:</div>
                            {Object.entries(additionalInfo).map(([key, value]) => (
                                <div key={key} className="flex justify-between mb-1">
                                    <span className="text-gray-400">{key}:</span>
                                    <span className="text-white max-w-32 truncate">{formatData(value)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Raw Data (collapsed by default) */}
                    <details className="mb-2">
                        <summary className="font-medium text-gray-300 cursor-pointer hover:text-white">
                            Raw Data
                        </summary>
                        <div className="mt-2 bg-gray-800 rounded p-2 max-h-40 overflow-auto">
                            <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                                {formatData(data)}
                            </pre>
                        </div>
                    </details>

                    {/* Timestamp */}
                    <div className="text-xs text-gray-500 border-t border-gray-700 pt-2">
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DebugPanel;