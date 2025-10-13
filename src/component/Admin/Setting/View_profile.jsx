import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../src/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import { Camera } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { view_admin_profile } from "../../../Redux_store/Api/adminProfile";
import "./Setting.css";
import {
  setName,
  setNumber,
} from "../../../Redux_store/slices/adminProfileSlice";

const View_Profile = () => {
  const [profileImg, setProfileImg] = useState("https://github.com/shadcn.png");
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.adminProfile || {});

  const admin = profile.admin || {};
  localStorage.setItem("adminID", admin.id);
  localStorage.setItem("Name", admin.full_name);
  localStorage.setItem("Number", admin.m_number);
  localStorage.setItem("Email", admin.email);

  useEffect(() => {
    dispatch(view_admin_profile());
    dispatch(setName(profile.name));
    dispatch(setNumber(profile.number));
  }, [dispatch]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImg(imageUrl);
    }
  };

  return (
    <>
      <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-6 w-full px-4 md:px-8">
        <div className="w-full sm:w-[24rem] md:w-[28rem]">
          <Card className="w-full h-[32em] shadow-xl rounded-2xl p-5">
            <CardHeader className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32">
                <Avatar className="w-full h-full shadow-lg rounded-full">
                  <AvatarImage
                    className="rounded-full border-4 border-blue-600"
                    src={
                      admin.image
                    }
                    alt={admin.full_name || "Admin"}
                  />
                  <AvatarFallback>{admin.full_name?.at(0)}</AvatarFallback>
                </Avatar>
                {/* 
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <button
                  className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-700 transition"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
                */}
              </div>
              <CardTitle className="mt-4 text-xl text-gray-600 dark:text-white font-semibold truncate  w-[190px]  block" title={admin.full_name || "Admin"}>
                {admin.full_name || "Admin"}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-white">Admin</CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                <li className="flex justify-between items-center font-medium">
                  <span className="text-gray-500 dark:text-white">Plan</span>
                  <span className="text-green-600 font-bold">
                    {admin.status}
                  </span>
                </li>
              </ul>
            </CardContent>

            <CardFooter className="flex justify-center gap-4">
              <span className="profile_portfolio text-gray-500 dark:text-white">Portfolio</span>
            </CardFooter>
          </Card>
        </div>

        <div className="w-full sm:w-[24rem] md:w-[28rem]">
          <Card className="w-full shadow-xl rounded-2xl p-6">
            <CardHeader>
              <div className="text-md text-center font-semibold text-gray-600 dark:text-white">
                <h1>Admin Details</h1>
              </div>
              <hr className="mt-2 border-gray-300" />
            </CardHeader>




            <CardContent className="p-5 mb-5">
              <ul className="space-y-3">
                {[
                  { label: "Full Name", value: admin.full_name },
                  { label: "Email", value: admin.email },
                  { label: "Phone Number", value: admin.m_number },
                  { label: "Status", value: admin.status },
                  {
                    label: "Created At",
                    value: admin.createdAt
                      ? new Date(admin.createdAt).toLocaleString()
                      : "N/A",
                  },
                ].map((item, index) => (
                  <React.Fragment key={index}>
                    <li className="flex justify-between text-gray-500 dark:text-white font-medium pt-5">
                      <p>{item.label}</p>
                      <span
                        className={`font-bold  ${item.value?.length > 15 ? item.label === "Full Name" || item.label === "Email"
                          ? "truncate w-[170px] block "
                          : ""
                          : ""}`}
                        title={item.value}
                      >
                        {item.value}
                      </span>
                    </li>
                    {index !== 4 && <hr className="border-gray-300" />}
                  </React.Fragment>
                ))}
              </ul>
            </CardContent>


          </Card>
        </div>
      </div>
    </>
  );
};

export default View_Profile;
