import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { CreditCard, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getEmisTotalAmounts } from "../../../Redux_store/Api/EmisApiStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../src/components/ui/select";
import Received from "./Received";
import { fromDate, toDate } from "../../../Redux_store/slices/EmisSlice";
import { setMonth, setYear } from "../../../Redux_store/slices/dateFilterSlice";

const Students = () => {
  let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector(
    (state) => state.emis.data || {}
  );
  console.log('====================================');
  console.log(data);
  console.log('====================================');

  const currentDate = new Date();
  const month = useSelector((state) => state.dateFilter.month);
  const year = useSelector((state) => state.dateFilter.year);

  const [firstDate, setFirstDate] = useState(null);
  const [lastDate, setLastDate] = useState(null);

  const totalAmount = data?.totalAmount || 0;

  useEffect(() => {
    if (month && year) {
      dispatch(
        getEmisTotalAmounts({ month: parseInt(month), year: parseInt(year), token })
      );
    }
  }, [dispatch, month, year]);

  useEffect(() => { }, [data, loading, error]);

  const cardData = [
    {
      title: "Received",
      value: data?.breakdown?.totalCollectedFees || 0,
      color: "text-green-600",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      link: `/paid`,
    },
    {
      title: "Upcoming",
      value: data?.breakdown?.totalUpcomingFees || 0,
      color: "text-yellow-600",
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
      link: `/upcoming`,
    },
    {
      title: "Missed",
      value: data?.breakdown?.totalMissedFees || 0,
      color: "text-red-600",
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      link: `/missed`,
    },
  ];

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const handleMonthChange = (value) => {
    dispatch(setMonth(value));
  };

  const handleYearChange = (value) => {
    dispatch(setYear(value));
  };

  useEffect(() => {
    if (month && year) {
      const firstDate = new Date(Number(year), Number(month) - 1, 1);
      const lastDate = new Date(Number(year), Number(month), 0);
      dispatch(fromDate(firstDate.toISOString()));
      dispatch(toDate(lastDate.toISOString()));
    }
  }, [month, year]);

  const years = Array.from({ length: 11 }, (_, i) => (2023 + i).toString());

  return (
    <div className="flex flex-col items-center min-h-screen p-4 space-y-6">
      <div className="w-full max-w-md flex space-x-4">
        <Select value={month} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={handleYearChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        <Card className="w-full p-4 shadow-lg rounded-2xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-center">
              Total Amount
            </CardTitle>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {loading ? (
              <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
            ) : error ? (
              <span className="text-red-500">Error: {error}</span>
            ) : (
              <span className="text-3xl font-bold text-blue-600">
                ₹ {totalAmount.toLocaleString()}
              </span>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <CardDescription className="text-gray-700 font-bold dark:text-gray-500">
              Updated Amount for {months.find((m) => m.value === month)?.label}{" "}
              {year}
            </CardDescription>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-8xl">
        {cardData.map((card, index) => (
          <div key={index} className="w-full">
            <Card className="w-full h-[300px] p-4 shadow-lg rounded-2xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-center">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                {loading ? (
                  <Loader2
                    className="animate-spin w-8 h-8"
                    style={{ color: card.color }}
                  />
                ) : error ? (
                  <span className="text-red-500">Error: {error}</span>
                ) : (
                  <span className={`text-2xl font-bold ${card.color}`}>
                    ₹ {card.value.toLocaleString()}
                  </span>
                )}

              </CardContent>
              <CardFooter className="flex flex-col items-center space-y-2">
                <CardDescription className="text-gray-700 font-bold dark:text-gray-500">
                  Updated Amount
                </CardDescription>
                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-md transition"
                  onClick={() =>
                    navigate(`${card.link}?month=${month}&year=${year}`)
                  }
                  disabled={loading}
                >
                  More Details
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Students;