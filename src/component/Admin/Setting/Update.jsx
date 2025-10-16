import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import { Input } from "../../src/components/ui/input";
import { Button } from "../../src/components/ui/button";
import { Mail, User, Phone } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../src/components/ui/form";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { Update_Admin } from "../../../Redux_store/Api/adminProfile";

const formSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name cannot be more than 30 characters." })
  ,
  email: z
    .string()
    .email({ message: "Enter a valid email address." }) // valid email check
    .trim() // whitespace remove
    .max(40, { message: "Email cannot be more than 40 characters." }),

  m_number: z
    .string({
      required_error: "Mobile number is required.",
      invalid_type_error: "Mobile number must be a string.",
    })
    .regex(
      /^[6-9][0-9]{9}$/,
      "Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9 (only digits allowed)."
    )
    .refine((val) => !/^(\d)\1{9}$/.test(val), {
      message:
        "Mobile number cannot have all digits the same (e.g., 6666666666).",
    })
    .refine((val) => !/\s/.test(val), {
      message: "Phone number cannot contain spaces.",
    }),
});

const Update = () => {
  const isDarkMode = true;
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      m_number: "",
    },
  });
  const { loading } = useSelector((state) => state.adminProfile);
  useEffect(() => {
    const storedName = localStorage.getItem("Name") || "";
    const storedNumber = localStorage.getItem("Number") || "";
    const storedEmail = localStorage.getItem("Email") || "";

    // Update form values
    form.setValue("full_name", storedName);
    form.setValue("m_number", storedNumber);
    form.setValue("email", storedEmail);
  }, [form]);

  const onSubmit = async (data) => {
    const phone = data.m_number.toString().trim();

    const adminID = localStorage.getItem("adminID") || "";

    const updatedData = {
      id: adminID,
      data: {
        full_name: data.full_name,
        email: data.email,
        m_number: phone,
      },
    };

    try {
      await dispatch(Update_Admin(updatedData)).unwrap();
      toast.success("Profile Updated Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      // Update localStorage with new values
      localStorage.setItem("Name", data.full_name);
      localStorage.setItem("Email", data.email);
      localStorage.setItem("Number", phone);
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Error updating profile";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  };

  return (
    <div className="p-6 flex justify-center items-center">
      <Card className="w-full max-w-4xl border shadow-xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-600 dark:text-white">
            Update Your Profile
          </CardTitle>
          <CardDescription className="text-sm dark:text-white">
            Enter your details below to update your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-700 dark:text-white font-semibold text-lg">
                        Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center overflow-hidden">
                          <Input
                            className={`w-full border-2 ${form.formState.errors.full_name
                                ? "border-red-500"
                                : "border-blue-300"
                              } rounded-xl pl-12 p-5 focus:ring-4 focus:ring-blue-500 shadow-lg`}
                            placeholder="Enter Your Name"
                            type="text"
                            {...field}
                          />
                          <span className="absolute right-4 text-gray-500 dark:text-white">
                            <User size={21} />
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-700 dark:text-white font-semibold text-lg">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center overflow-hidden">
                          <Input
                            className={`w-full border-2 ${form.formState.errors.email
                                ? "border-red-500"
                                : "border-blue-300"
                              } rounded-xl pl-12 p-5 focus:ring-4 focus:ring-blue-500 shadow-lg`}
                            placeholder="Enter Your Email"
                            type="email"
                            {...field}
                          />
                          <span className="absolute right-4 text-gray-500 dark:text-white">
                            <Mail size={21} />
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="m_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-700 dark:text-white font-semibold text-lg">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center overflow-hidden">
                          <Input
                            className={`w-full border-2 ${form.formState.errors.m_number
                                ? "border-red-500"
                                : "border-blue-300"
                              } rounded-xl pl-12 p-5 focus:ring-4 focus:ring-blue-500 shadow-lg`}
                            placeholder="Enter Your Phone Number"
                            type="tel"
                            {...field}
                          />
                          <span className="absolute right-4 text-gray-500 dark:text-white">
                            <Phone size={21} />
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />
              </div>
              <CardFooter className="flex justify-center mt-5">
                <Button
                  type="submit"
                  className="w-full md:w-[300px] mt-8 bg-blue-900 shadow-lg hover:bg-blue-800"
                  disabled={loading}
                >
                  Update
                </Button>
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={false}
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme={isDarkMode ? "dark" : "light"}
                  transition={Zoom}
                />
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Update;
