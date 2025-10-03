import React from 'react';

const Loader = ({ text }: { text: string }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-400"></div>
            <p className="text-violet-300 text-lg">{text}</p>
        </div>
    );
};

export default Loader;
