// src/Loading.js
import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ClipLoader size={50} color={"#123abc"} loading={true} />
      <p className="mt-4 text-xl">Loading...</p>
    </div>
  );
};

export default Loading;
