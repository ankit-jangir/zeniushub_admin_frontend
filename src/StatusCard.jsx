// components/StatusCard.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircle, XCircle, X } from "lucide-react";
import { hideStatus } from "./Redux_store/slices/Status_slice";

const StatusCard = () => {
    const dispatch = useDispatch();
    const { show, type, message } = useSelector((state) => state.status);

    if (!show) return null;

    const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
    const textColor = type === "success" ? "text-green-800" : "text-red-800";
    const Icon = type === "success" ? CheckCircle : XCircle;

    return (
        <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`rounded-lg shadow-md px-6 py-4 flex items-center gap-3 relative ${bgColor} ${textColor}`}>
                <Icon className="w-6 h-6" />
                <span className="text-base font-medium">{message}</span>
                <button
                    onClick={() => dispatch(hideStatus())}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default StatusCard;
