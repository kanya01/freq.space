// frontend/src/features/profile/components/ProfilePortfolio.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    PlayIcon,
    PauseIcon,
    MusicalNoteIcon,
    FilmIcon,
    PhotoIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon
} from '@heroicons/react/24/solid';

const ProfilePortfolio = ({ user, isOwnProfile = false }) => {
    const [playing, setPlaying] = useState(null);
    const [modalItem, setModalItem] = useState(null);

    const getMediaIcon = (mediaType) => {
        switch (mediaType) {
            case 'audio':
                return <MusicalNoteIcon className="h-8 w-8 text-white" />;
            case 'video':
                return <FilmIcon className="h-8 w-8 text-white" />;
            case 'image':
                return <PhotoIcon className="h-8 w-8 text-white" />;
            default:
                return null;
        }
    };

    const handlePlayPause = (itemId) => {
        if (playing === itemId) {
            setPlaying(null);
        } else {
            setPlaying(itemId);
        }
    };

    // If not own profile and no portfolio items, don't render anything
    if (!user.profile.portfolio?.length && !isOwnProfile) {
        return null;
    }

    return (
        <div className="bg-gray-900 rounded-lg p-6">
            {/* Header with title and add button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Portfolio</h2>
                {isOwnProfile && (
                    <Link
                        to="/profile/edit#portfolio"
                        className="flex items-center text-sm text-blue-400 hover:text-blue-300"
                    >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Item
                    </Link>
                )}
            </div>

            {/* Empty state for own profile */}
            {(!user.profile.portfolio?.length && isOwnProfile) && (
                <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No portfolio items yet</p>
                    <Link
                        to="/profile/edit#portfolio"
                        className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Your First Item
                    </Link>
                </div>
            )}

            {/* Portfolio grid */}
            {user.profile.portfolio?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.profile.portfolio.map((item) => (
                        <div
                            key={item._id}
                            className="bg-gray-800 rounded-lg overflow-hidden group cursor-pointer relative"
                            onClick={() => setModalItem(item)}
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-w-16 aspect-h-9">
                                {item.thumbnailUrl ? (
                                    <img
                                        src={item.thumbnailUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                        {getMediaIcon(item.mediaType)}
                                    </div>
                                )}

                                {/* Play overlay for audio/video */}
                                {(item.mediaType === 'audio' || item.mediaType === 'video') && (
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePlayPause(item._id);
                                            }}
                                            className="p-3 bg-white rounded-full"
                                        >
                                            {playing === item._id ? (
                                                <PauseIcon className="h-6 w-6 text-black" />
                                            ) : (
                                                <PlayIcon className="h-6 w-6 text-black" />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="text-white font-medium truncate">{item.title}</h3>
                                <p className="text-gray-400 text-sm truncate">{item.description}</p>
                            </div>

                            {/* Edit/Delete options for own profile */}
                            {isOwnProfile && (
                                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        to={`/profile/edit#portfolio-${item._id}`}
                                        className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <PencilIcon className="h-4 w-4 text-white" />
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // TODO: Add delete functionality
                                            console.log('Delete item:', item._id);
                                        }}
                                        className="p-2 bg-red-600 bg-opacity-50 rounded-full hover:bg-opacity-75"
                                    >
                                        <TrashIcon className="h-4 w-4 text-white" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for viewing items */}
            {modalItem && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{modalItem.title}</h3>
                                    {isOwnProfile && (
                                        <Link
                                            to={`/profile/edit#portfolio-${modalItem._id}`}
                                            className="text-sm text-blue-400 hover:text-blue-300"
                                        >
                                            Edit this item
                                        </Link>
                                    )}
                                </div>
                                <button
                                    onClick={() => setModalItem(null)}
                                    className="text-gray-400 hover:text-white text-2xl leading-none"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Media display */}
                            <div className="mb-4">
                                {modalItem.mediaType === 'image' && (
                                    <img
                                        src={modalItem.mediaUrl}
                                        alt={modalItem.title}
                                        className="w-full rounded-lg"
                                    />
                                )}
                                {modalItem.mediaType === 'audio' && (
                                    <audio controls className="w-full">
                                        <source src={modalItem.mediaUrl} />
                                    </audio>
                                )}
                                {modalItem.mediaType === 'video' && (
                                    <video controls className="w-full rounded-lg">
                                        <source src={modalItem.mediaUrl} />
                                    </video>
                                )}
                            </div>

                            <p className="text-gray-300">{modalItem.description}</p>

                            {/* Additional metadata */}
                            <div className="mt-4 text-sm text-gray-400">
                                <p>Uploaded: {new Date(modalItem.createdAt).toLocaleDateString()}</p>
                                <p>Type: {modalItem.mediaType}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePortfolio;