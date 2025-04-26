import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import ProfileView from '../features/profile/components/ProfileView';

function ProfilePage() {
    const user = useSelector(selectUser);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen bg-black">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return <ProfileView user={user} isOwnProfile={true} />;
}

export default ProfilePage;