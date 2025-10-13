import React from 'react'
import { Button } from "../../src/components/ui/button";
import { ThumbsUp } from "lucide-react";
const ThankYouCard = () => {
    return (
        <div className="flex flex-col items-center justify-center  p-6  rounded-2xl max-w-sm mx-auto">
            <div className="relative mb-4">
                <div className="flex items-center justify-center w-28 h-28 bg-blue-500 rounded-full">
                    <ThumbsUp className="text-white w-14 h-14" />
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-teal-500">
                    <span className="text-lg">✨ 🎉</span>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-blue-700">THANK YOU!</h2>
            <p className="text-gray-600 text-center mt-2">
                Your Data Update Successfully
            </p>
            {/* <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white flex items-center">
                KEEP EXPLORING 
            </Button> */}
        </div>
    )
}

export default ThankYouCard
