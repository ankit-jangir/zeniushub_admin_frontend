import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../component/src/components/ui/form";
import { Input } from "../../component/src/components/ui/input";
import { Button } from "../src/components/ui/button";
import { useNavigate } from "react-router";

const FormSchema = z.object({
  Code: z
    .string()
    .max(4, "School code is required")
    .refine((val) => val === "1918", {
      message: "School code is wrong",
    }),
});

const Login = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Code: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form data:", data);
    navigate("/Adminlogin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff]">
      <div className="flex w-full h-screen">
        {/* LEFT SECTION */}
        <div className="hidden md:flex w-1/2 bg-[#ff4500] relative overflow-hidden flex-col justify-center px-16 text-white">
          {/* background circular pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <svg
              viewBox="0 0 800 800"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full opacity-15 scale-150"
            >
              <circle cx="400" cy="400" r="300" fill="none" stroke="white" strokeWidth="80" />
              <circle cx="400" cy="400" r="500" fill="none" stroke="white" strokeWidth="40" />
            </svg>
          </div>

          {/* text */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white" />
              </div>
              <h1 className="text-xl font-semibold tracking-wide">Zeniushub</h1>
            </div>

            <h2 className="text-4xl font-bold leading-snug mb-3">
              Login into <br /> your account
            </h2>
            <p className="text-white/90 text-sm max-w-xs">
              Enter right credentials to access your panel
            </p>
          </div>


        </div>

        {/* RIGHT SECTION */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#fff]">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-2xl font-bold text-center text-[#ff4500]">
                  Admin Login
                </h2>
                <p className="text-center text-gray-500 text-sm mb-6">
                  Enter your credentials to access the panel
                </p>

                <FormField
                  control={form.control}
                  name="Code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 font-medium">
                        Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your school code"
                          className="w-full mt-1 border border-gray-300 rounded-md px-3 py-3 text-gray-800 focus:ring-2 focus:ring-[#ff4500]/70 focus:outline-none"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#ff4500] hover:bg-[#e03e00] text-white py-3 rounded-md text-md font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Login
                </Button>


              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
