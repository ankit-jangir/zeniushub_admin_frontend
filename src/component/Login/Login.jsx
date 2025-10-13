import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import '../../../src/App.css';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../component/src/components/ui/form';
import { Input } from '../../component/src/components/ui/input';
import { Label } from '../../component/src/components/ui/label';
import { Checkbox } from '../../component/src/components/ui/checkbox';
import { Button } from '../src/components/ui/button';
import { useNavigate } from 'react-router';

const FormSchema = z.object({
  Code: z
    .string()
    .min(1, "School code is required")
    .refine((val) => val === "19", {
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
    console.log('Form data:', data);
    navigate("/Adminlogin")
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 px-4 sm:px-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-16 w-full max-w-md sm:max-w-4xl flex flex-col sm:flex-row overflow-hidden transform transition-all duration-500 hover:scale-105">

        {/* Left Side - Welcome Message (Hidden on small screens) */}
        <div className="hidden sm:flex flex-col justify-center  w-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-8 sm:p-16 rounded-l-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold animate-bounce">Welcome to Intellix</h2>
          <p className="text-sm sm:text-lg mt-4 opacity-90">Your trusted admin portal</p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full sm:w-1/2 px-6 sm:px-12 py-8 sm:py-10  flex flex-col justify-center">
          <h3 className='text-2xl sm:text-4xl font-bold text-gray-800 text-center'>Admin Login</h3>
          <p className='text-gray-500 mt-3 sm:mt-4 text-center mb-6 sm:mb-10 text-sm sm:text-lg'>Enter your credentials to access the dashboard.</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-10">
              <FormField
                control={form.control}
                name="Code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block pb-5 text-gray-700 font-semibold text-lg sm:text-xl">School Code</FormLabel>
                    <FormControl>
                      <Input className="w-full text-black border-gray-300 rounded-xl p-3 sm:p-5 focus:ring-4 focus:ring-blue-500 shadow-lg" placeholder="Enter Your Code" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className='w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 sm:py-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-xl text-lg sm:text-xl font-bold' type="submit">Login</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
