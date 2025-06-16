import React, { useState, useRef } from 'react';
import { XMarkIcon, ArrowUturnLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

const ImageEditor = ({ imageUrl, onSave, onClose }) => {
    const canvasRef = useRef(null);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [rotation, setRotation] = useState(0);

    // Apply filters to canvas
    const applyFilters = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            ctx.restore();
        };

        img.src = imageUrl;
    };

    React.useEffect(() => {
        applyFilters();
    }, [brightness, contrast, saturation, rotation]);

    const handleSave = () => {
        canvasRef.current.toBlob((blob) => {
            onSave(blob);
        }, 'image/jpeg', 0.95);
    };

    const resetFilters = () => {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setRotation(0);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-timberwolf-200">
                    <h2 className="text-2xl font-bold text-eerie-black">Edit Image</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-timberwolf-100 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6 text-black-olive" />
                    </button>
                </div>

                {/* Editor Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    {/* Canvas */}
                    <div className="lg:col-span-2 bg-timberwolf-100 rounded-xl p-4 flex items-center justify-center">
                        <canvas
                            ref={canvasRef}
                            className="max-w-full max-h-[400px] rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Controls */}
                    <div className="space-y-6">
                        {/* Brightness */}
                        <div>
                            <label className="block text-sm font-medium text-black-olive-700 mb-2">
                                Brightness: {brightness}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="200"
                                value={brightness}
                                onChange={(e) => setBrightness(e.target.value)}
                                className="w-full accent-flame-600"
                            />
                        </div>

                        {/* Contrast */}
                        <div>
                            <label className="block text-sm font-medium text-black-olive-700 mb-2">
                                Contrast: {contrast}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="200"
                                value={contrast}
                                onChange={(e) => setContrast(e.target.value)}
                                className="w-full accent-flame-600"
                            />
                        </div>

                        {/* Saturation */}
                        <div>
                            <label className="block text-sm font-medium text-black-olive-700 mb-2">
                                Saturation: {saturation}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="200"
                                value={saturation}
                                onChange={(e) => setSaturation(e.target.value)}
                                className="w-full accent-flame-600"
                            />
                        </div>

                        {/* Rotation */}
                        <div>
                            <label className="block text-sm font-medium text-black-olive-700 mb-2">
                                Rotation: {rotation}°
                            </label>
                            <input
                                type="range"
                                min="-180"
                                max="180"
                                value={rotation}
                                onChange={(e) => setRotation(e.target.value)}
                                className="w-full accent-flame-600"
                            />
                        </div>

                        {/* Preset Filters */}
                        <div>
                            <label className="block text-sm font-medium text-black-olive-700 mb-2">
                                Quick Filters
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => {
                                        setBrightness(110);
                                        setContrast(110);
                                        setSaturation(120);
                                    }}
                                    className="px-3 py-2 bg-timberwolf-100 text-black-olive-700 rounded-lg hover:bg-timberwolf-200 transition-colors text-sm"
                                >
                                    Vibrant
                                </button>
                                <button
                                    onClick={() => {
                                        setBrightness(95);
                                        setContrast(105);
                                        setSaturation(0);
                                    }}
                                    className="px-3 py-2 bg-timberwolf-100 text-black-olive-700 rounded-lg hover:bg-timberwolf-200 transition-colors text-sm"
                                >
                                    B&W
                                </button>
                                <button
                                    onClick={() => {
                                        setBrightness(120);
                                        setContrast(90);
                                        setSaturation(80);
                                    }}
                                    className="px-3 py-2 bg-timberwolf-100 text-black-olive-700 rounded-lg hover:bg-timberwolf-200 transition-colors text-sm"
                                >
                                    Soft
                                </button>
                                <button
                                    onClick={() => {
                                        setBrightness(90);
                                        setContrast(120);
                                        setSaturation(110);
                                    }}
                                    className="px-3 py-2 bg-timberwolf-100 text-black-olive-700 rounded-lg hover:bg-timberwolf-200 transition-colors text-sm"
                                >
                                    Drama
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between p-6 border-t border-timberwolf-200">
                    <button
                        onClick={resetFilters}
                        className="inline-flex items-center px-4 py-2 bg-timberwolf-100 text-black-olive-700 rounded-lg hover:bg-timberwolf-200 transition-colors"
                    >
                        <ArrowUturnLeftIcon className="h-4 w-4 mr-2" />
                        Reset
                    </button>

                    <div className="space-x-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white border border-eerie-black text-eerie-black rounded-lg hover:bg-timberwolf-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="inline-flex items-center px-6 py-2 bg-flame-600 text-white rounded-lg hover:bg-flame-700 transition-colors"
                        >
                            <CheckIcon className="h-4 w-4 mr-2" />
                            Apply Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;