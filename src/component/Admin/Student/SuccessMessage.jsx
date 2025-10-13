import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogFooter } from "../../src/components/ui/dialog"; // Adjust path based on your project
import { Button } from "../../src/components/ui/button"; // Adjust path based on your project
import ThankYouCard from "../Dashboard/ThankYouCard"; // Adjust path based on your project
import emoji from "../Student/img/emoji.png"; // Ensure this path is correct

const SuccessMessage = () => {
  const navigate = useNavigate();
  const [AddConfrom, setAddConfrom] = useState(true); // Set to true to show dialog initially

  return (
    <Dialog open={AddConfrom} onOpenChange={setAddConfrom}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-full max-w-[90vw] sm:max-w-[400px] p-6 rounded-lg"
      >
        <ThankYouCard />
        {/* Dialog Footer */}
        <DialogFooter className="flex justify-end gap-3">
          <Button
            onClick={() => setAddConfrom(false)}
            variant="outline"
            className="w-full sm:w-auto mt-4 bg-gray-100 hover:bg-gray-200 hover:text-black px-5 py-2 rounded-md text-black flex items-center transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setAddConfrom(false);
              navigate("/students"); // Navigate to the students page
            }}
            className="w-full sm:w-auto mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md flex items-center shadow-md transition-all"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessMessage;