import React from 'react';
import emoji from '../Student/img/emoji.png';
import { Button } from '../../src/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Message = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/students');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  px-4 py-8 sm:px-6 md:px-8">
      <img
        src={emoji}
        alt="Success"
        className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 mb-6 animate-bounce"
      />

      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold  text-center mb-4">
        Student Added Successfully
      </h1>

      <p className="text-sm sm:text-base md:text-lg text-gray-500 text-center mb-8 max-w-md">
        The new student record has been created and saved in the system.
      </p>

      <Button
        onClick={handleBack}
        className="bg-blue-600 hover:bg-blue-700   text-white text-sm sm:text-base md:text-lg px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg transition duration-300"
      >
        Back to Students
      </Button>
    </div>
  );
};

export default Message;
