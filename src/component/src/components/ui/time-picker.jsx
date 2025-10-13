import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";
import { Clock } from "lucide-react";

// Generate numbers for hours (00-23) and minutes (00-59)
const generateNumbers = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    (i + start).toString().padStart(2, "0")
  );

const TimePicker = ({ label, selectedTime, setSelectedTime }) => {
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [open, setOpen] = useState(false);

  const hours = generateNumbers(0, 23);
  const minutes = generateNumbers(0, 59);

  const handleTimeSelect = () => {
    setSelectedTime(`${selectedHour}:${selectedMinute}`);
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-center">
      <h4 className="font-medium mb-1">{label}</h4>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-40">
            {selectedTime || "--"}
            <Clock />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3 bg-white rounded-lg shadow-md">
          <div className="flex justify-between gap-2">
            {/* Hour & Minute Scrollable Dropdowns */}
            <div className="w-full flex justify-between">
              {/* Hour List (Scrollable) */}
              <div
                className="w-24 h-48 overflow-y-auto border rounded-md custom-scrollbar"
                onWheel={(e) => {
                  e.currentTarget.scrollTop += e.deltaY;
                }}
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    onClick={() => setSelectedHour(hour)}
                    className={`cursor-pointer px-3 py-2 text-center ${
                      selectedHour === hour
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-200 text-black"
                    }`}
                  >
                    {hour}
                  </div>
                ))}
              </div>

              <span className="mx-2 font-bold">:</span>

              {/* Minute List (Scrollable) */}
              <div
                className="w-24 h-48 overflow-y-auto border rounded-md custom-scrollbar"
                onWheel={(e) => {
                  e.currentTarget.scrollTop += e.deltaY;
                }}
              >
                {minutes.map((minute) => (
                  <div
                    key={minute}
                    onClick={() => setSelectedMinute(minute)}
                    className={`cursor-pointer px-3 py-2 text-center ${
                      selectedMinute === minute
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-200 text-black"
                    }`}
                  >
                    {minute}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleTimeSelect}
            className="bg-blue-500 hover:bg-blue-600 w-full mt-3"
          >
            Confirm Time
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimePicker;
