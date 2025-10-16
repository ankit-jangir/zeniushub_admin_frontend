import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Eye, EyeOff } from "lucide-react";
import "../../../src/App.css";
import "./Login.css";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../component/src/components/ui/form";
import { Input } from "../../component/src/components/ui/input";
import { Checkbox } from "../../component/src/components/ui/checkbox";
import { Button } from "../src/components/ui/button";

import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import loginAdmin from "../../Redux_store/Api/Login_admin";
import { setToken } from "../../Redux_store/slices/Logout_Admin";
import { setAdminToken } from "../../Redux_store/slices/adminProfileSlice";

const FormSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      terms: false,
    },
  });

  const onSubmit = async (data, event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await dispatch(
        loginAdmin({ email: data.email, password: data.password })
      ).unwrap();

      if (response.status === "001" && response.token) {
        localStorage.setItem("token", response.token);
        dispatch(setToken(response.token));
        dispatch(setAdminToken(response.token));
        setTimeout(() => {
          setIsSubmitting(false);
          navigate("/Dashboard");
        }, 300);
      } else {
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-full md:w-1/2 bg-[#ff4500] relative overflow-hidden flex-col justify-center px-8 lg:px-16 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <svg
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full opacity-10 scale-150"
          >
            <circle cx="400" cy="400" r="300" fill="none" stroke="white" strokeWidth="80" />
            <circle cx="400" cy="400" r="500" fill="none" stroke="white" strokeWidth="40" />
          </svg>
        </div>

        <div className="relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <h1 className="text-lg md:text-xl font-semibold tracking-wide">Zeniushub</h1>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold leading-snug mb-3">
            Login into <br /> your account
          </h2>
          <p className="text-white/90 text-sm md:text-base max-w-sm">
            Enter the correct credentials to access your panel
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-white px-6 sm:px-8 lg:px-12 py-12 md:py-0">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white shadow-xl rounded-2xl p-6 sm:p-8 md:p-10">
          <h2 className="text-center text-[#ff4500] text-2xl sm:text-3xl font-bold mb-2">
            Admin Login
          </h2>
          <p className="text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            Enter your credentials to access the panel
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4500] focus:border-[#ff4500] p-3 pl-10 sm:pl-12 text-sm sm:text-base"
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                        />
                        <Mail size={18} className="absolute left-3 text-gray-500" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4500] focus:border-[#ff4500] p-3 pr-10 text-sm sm:text-base"
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <span
                          className="absolute right-3 text-gray-500 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Checkbox */}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#ff4500] data-[state=checked]:border-[#ff4500]"
                      />
                      <label htmlFor="terms" className="text-gray-700 text-xs sm:text-sm">
                        Accept terms and conditions
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Button */}
              <Button
                disabled={isSubmitting}
                className="w-full bg-[#ff4500] hover:bg-[#ff5c1c] text-white text-sm sm:text-base md:text-lg rounded-lg py-2 sm:py-3 transition-all shadow-md"
                type="submit"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
