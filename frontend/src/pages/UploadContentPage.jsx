// frontend/src/pages/UploadTrackPage.jsx
import React from 'react';
import ContentUpload from '../features/content/components/ContentUpload';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const UploadContentPage = () => {
    return (
        <div className="min-h-screen bg-floral-white">
            <Header />

            <main className="relative">
                {/* Decorative elements matching HomePage */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-flame-900 rounded-full filter blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-timberwolf-300 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <ContentUpload />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UploadContentPage;