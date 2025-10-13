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
import { Label } from "../../component/src/components/ui/label";
import { Checkbox } from "../../component/src/components/ui/checkbox";
import { Button } from "../src/components/ui/button";

import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.login || {});
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
        loginAdmin({
          email: data.email,
          password: data.password,
        })
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 px-4 sm:px-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-16 w-full max-w-md sm:max-w-4xl flex flex-col sm:flex-row overflow-hidden transform transition-all duration-500 hover:scale-105 h-auto sm:h-[600px]">
        <div className="hidden sm:flex flex-col justify-center w-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-8 sm:p-16 rounded-l-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold animate-bounce">
            Welcome to Intellix
          </h2>
          <p className="text-sm sm:text-lg mt-4 opacity-90">
            Your trusted admin portal
          </p>
        </div>

        <div className="w-full sm:w-1/2 px-6 sm:px-12 py-8 sm:py-10 flex flex-col justify-center">
          <h3 className="text-2xl sm:text-4xl font-bold text-gray-800 text-center">
            Admin Login
          </h3>
          <p className="text-gray-500 mt-3 sm:mt-4 text-center mb-6 sm:mb-10 text-sm sm:text-lg">
            Enter your credentials to access the dashboard.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-10"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block margin text-gray-700 font-semibold text-lg sm:text-xl">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          className="w-full text-black border-gray-300 rounded-xl pl-12 p-3 sm:p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter Your Email"
                          type="email"
                          {...field}
                        />
                        <span className="absolute right-4 text-gray-500">
                          <Mail size={21} />
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block margin text-gray-700 font-semibold text-lg sm:text-xl">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          className="w-full border-gray-300 text-black rounded-xl p-3 sm:p-5 pr-12 focus:ring-4 focus:ring-blue-500 shadow-lg"
                          placeholder="Enter Your Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <span
                          className="absolute right-4 text-gray-500 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye size={21} />
                          ) : (
                            <EyeOff size={21} />
                          )}
                        </span>
                      </div>
                    </FormControl>
                    {error && (
                      <p className="text-sm text-red-600 mt-2">
                        {error?.error?.[0]?.message ||
                          error?.message ||
                          "Login failed. Please try again."}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex margin items-center space-x-3">
                      <Checkbox
                        id="terms"
                        className="w-4 sm:w-5 h-4 sm:h-5"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label
                        htmlFor="terms"
                        className="text-gray-700 checkbox text-sm sm:text-lg"
                      >
                        Accept terms and conditions
                      </Label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={isSubmitting}
                className="w-full margin bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 sm:py-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-xl text-lg sm:text-xl font-bold"
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
