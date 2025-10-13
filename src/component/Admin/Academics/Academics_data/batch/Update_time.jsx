import React, { useEffect, useState } from "react";
import { Button } from "../../../../src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../src/components/ui/dialog";
import { Label } from "../../../../src/components/ui/label";
import { Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  get_Batches,
  update_time_Batches,
} from "../../../../../Redux_store/Api/Batches";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateTime = ({ id, s, e, searchTerm, page, limit, querystatus }) => {
  const defaultFromTime = new Date();
  defaultFromTime?.setHours(
    Number(s?.split(":")[0]) || 0,
    Number(s?.split(":")[1]) || 0,
    0,
    0
  );

  const defaultToTime = new Date();
  defaultToTime?.setHours(
    Number(e?.split(":")[0]) || 0,
    Number(e?.split(":")[1]) || 0,
    0,
    0
  );

  const [fromTime, setFromTime] = useState(defaultFromTime);
  const [toTime, setToTime] = useState(defaultToTime);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.logout.token) || localStorage.getItem("token");
  const isDarkMode = true;

  // Validate token on component mount
  useEffect(() => {
    console.log("Token:", token); // Debug log
    if (!token || typeof token !== "string") {
      setError("Authentication token is missing or invalid. Please log in again.");
      toast.error("Authentication token is missing or invalid. Please log in again.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  }, [token]);

  const validateTimes = () => {
    if (!fromTime || !toTime) return "Both time fields are required.";
    if (fromTime >= toTime) return "Start time must be before end time.";
    if (!id || isNaN(id)) return "Invalid batch ID.";
    if (!token) return "Authentication token is missing.";
    return "";
  };

  const handleSave = async () => {
    const validationError = validateTimes();
    if (validationError) {
      setError(validationError);
      toast.error(validationError, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
      return;
    }

    setError("");
    setLoading(true);

    const data = {
      id,
      StartTime: fromTime.toLocaleTimeString("en-US", { hour12: false }),
      EndTime: toTime.toLocaleTimeString("en-US", { hour12: false }),
      token, // Include token
    };

    try {
      console.log("Saving batch time with data:", data); // Debug log
      await dispatch(update_time_Batches(data)).unwrap();

      await dispatch(
        get_Batches({
          token,
          querystatus: "active",
          searchTerm,
          page,
          limit,
        })
      ).unwrap();

      toast.success("Batch timing updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      setOpen(false);
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to update batch timing. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
      console.error("Error updating time or fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) setError("");
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            onClick={() => setOpen(true)}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
            disabled={!token} // Disable button if token is missing
          >
            <Clock />
            Update
          </Button>
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-[500px] flex flex-col items-center justify-center"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              Update Batch Timing
            </DialogTitle>
          </DialogHeader>

          <div className="w-full flex flex-col items-center justify-center gap-6 py-4">
            <div className="flex flex-col sm:flex-row gap-6 w-full">
              <div className="flex-1 flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-600 mt-6" />
                <div className="w-full">
                  <Label className="text-sm text-gray-700">From Time</Label>
                  <DatePicker
                    selected={fromTime}
                    onChange={(date) => setFromTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="From Time"
                    className="w-full border px-3 py-2 rounded focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-600 mt-6" />
                <div className="w-full">
                  <Label className="text-sm text-gray-700">To Time</Label>
                  <DatePicker
                    selected={toTime}
                    onChange={(date) => setToTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="To Time"
                    className="w-full border px-3 py-2 rounded focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm text-center">
                {error}
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-center w-full">
            <Button onClick={handleSave} type="button" disabled={loading || !token}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateTime;