import React from 'react'
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "../../src/components/ui/card"
import { Sun, UserCheck, Users, UserX } from 'lucide-react'
import { fetchAttendance, fetchEmployeeAttendance } from '../../../Redux_store/Api/Attendance'
import { useDispatch, useSelector } from 'react-redux'

const CardHeaderAtt = ({ value, count, apiData }) => {

   let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);
  const dispatch = useDispatch();

  const sessionID = useSelector((state) => state.session?.selectedSession);

  const apiCall = (status) => {
    value === "student_att" ? dispatch(
      fetchAttendance({
        sessionID,
        ...apiData.s,
        name: apiData.sn,
        status: status,
        page: apiData.p,
        limit: apiData.l,
        date: apiData.d,
        selectedTab: apiData.stb,
        token
      })
    ) :
      dispatch(fetchEmployeeAttendance({token, first_name: apiData.n, attendence_date: apiData.d, page: apiData.cp, limit: apiData.l, status: status }));
  }


  const cardCount = [
    {
      class: "bg-blue-600",
      title: `Total ${value === "student_att" ? "Student" : "Team"}`,
      icon: Users,
      count: count.t,
      status: ""
    },
    {
      class: "bg-green-600",
      title: "Present",
      icon: UserCheck,
      count: count.p,
      status: "present"
    },
    {
      class: "bg-red-600",
      title: "Absent",
      icon: UserX,
      count: count.a,
      status: "absent"
    },
    {
      class: "bg-yellow-500",
      title: "Halfday",
      icon: Sun,
      count: count.h,
      status: value === "student_att" ? "half day" : "half_day"
    },
  ]


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 ps-2 pe-2">
      {
        cardCount?.map((v, i) => {
          const Icon = v.icon;
          return (
            <Card onClick={() => apiCall(v.status)} key={i} className={`cursor-pointer w-full max-w-sm ${v.class} text-white rounded-xl shadow-lg`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium">{v.title}</CardTitle>
                  <CardDescription className="text-3xl font-bold text-white">{v.count}</CardDescription>
                </div>

                <Icon className="h-10 w-10 text-white opacity-80" />
              </CardHeader>
              <CardContent />
            </Card>

          )
        })
      }

    </div>
  )
}

export default CardHeaderAtt
