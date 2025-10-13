import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../src/components/ui/card";
import { Input } from "../../src/components/ui/input";
import { Button } from "../../src/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../src/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../src/components/ui/dialog";
import ThankYouCard from "../Dashboard/ThankYouCard";
import { change_admin_password } from "../../../Redux_store/Api/adminProfile";
import { setAdminToken } from "../../../Redux_store/slices/adminProfileSlice";
import { toast, ToastContainer, Zoom } from "react-toastify";
const isDarkMode = true;

// ✅ Zod Validation Schema
const formSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .refine((val) => !/\s/.test(val), "Password cannot contain spaces."),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters.")
      .refine(
        (val) => !/\s/.test(val),
        "Confirm password cannot contain spaces."
      ),
    oldPassword: z
      .string()
      .min(6, "Old password must be at least 6 characters.")
      .refine((val) => !/\s/.test(val), "Old password cannot contain spaces."),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

const PasswordChange = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOld, setShowOld] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setAdminToken(token));
    }
  }, [dispatch]);

  const { loading, error, token, passwordChangeSuccess } = useSelector(
    (state) => state.adminProfile
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      oldPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        current_password: data.oldPassword,
        new_password: data.password,
        confirm_password: data.confirmPassword,
      };

      await dispatch(change_admin_password({ data: payload, token })).unwrap();
      toast.success("Admin Password Successfully", {
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

      form.reset();
    } catch (err) {
       const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "An error occurred"
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

      console.error("Password change failed:", err);
    }
  };

  const handleConfirm = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    dispatch(resetPasswordState());
  };

  return (
    <div className="pt-6 flex justify-center">
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
      <Card className="w-full sm:max-w-md md:max-w-lg border shadow-xl p-4 sm:p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-600 dark:text-white">
            Change Your Password
          </CardTitle>
          <CardDescription className="text-sm sm:text-base dark:text-white">
            Enter a new password below to update your <br /> credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* New Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700  dark:text-white font-semibold text-lg">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter New Password"
                          className="w-full border border-blue-300 rounded-xl p-4 sm:p-5 pr-10 focus:ring-4 focus:ring-blue-500 shadow-lg"
                          {...field}
                        />
                        <span
                          className="absolute right-3 text-gray-500 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Eye /> : <EyeOff />}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-red-500 mt-2" />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel className="text-gray-700 dark:text-white font-semibold text-lg">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Confirm Password"
                          className="w-full border border-blue-300 rounded-xl p-4 sm:p-5 pr-10 focus:ring-4 focus:ring-blue-500 shadow-lg"
                          {...field}
                        />
                        <span
                          className="absolute right-3 text-gray-500 cursor-pointer"
                          onClick={() => setShowConfirm(!showConfirm)}
                        >
                          {showConfirm ? <Eye /> : <EyeOff />}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-red-500 mt-2" />
                  </FormItem>
                )}
              />

              {/* Old Password */}
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel className="text-gray-700 dark:text-white font-semibold text-lg">
                      Old Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          type={showOld ? "text" : "password"}
                          placeholder="Old Password"
                          className="w-full border border-blue-300 rounded-xl p-4 sm:p-5 pr-10 focus:ring-4 focus:ring-blue-500 shadow-lg"
                          {...field}
                        />
                        <span
                          className="absolute right-3 text-gray-500 cursor-pointer"
                          onClick={() => setShowOld(!showOld)}
                        >
                          {showOld ? <Eye /> : <EyeOff />}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-red-500 mt-2" />
                  </FormItem>
                )}
              />
              {/* {error && (
                <p style={{ color: "red" }}>
                  {typeof error === "object" ? error.message : error}
                </p>
              )}

              {passwordChangeSuccess && (
                <p className="text-green-500 mt-2">{passwordChangeSuccess}</p>
              )} */}
              {/* Submit Button */}
              <CardFooter className="flex justify-center mt-5">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-[300px] bg-blue-500 shadow-lg hover:bg-blue-700"
                >
                  {loading ? "Updating..." : "CHANGE PASSWORD"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordChange;
