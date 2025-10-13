import React, { useEffect, useState } from "react";
import { Button } from "../../src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/ui/dialog";
import { Input } from "../../src/components/ui/input";
import { Label } from "../../src/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import {
  addSchoolInfo,
  get_school,
  updateSchoolInfo,
} from "../../../Redux_store/Api/School_image";
import { Textarea } from "../../src/components/ui/textarea";
import logo from "../../../assets/Image/intellix.png";
import { ToastContainer, toast, Zoom } from "react-toastify";
// import { addSchoolInfo, get_school } from "../../../Redux_store/Api/School_image";

const base_img_url = "https://adminv2-api-dev.intellix360.in/";
const isDarkMode = true;

const AddSchoolImg = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.logout.token);
  const { school } = useSelector((state) => state.schools);

  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [school_name, setSchoolName] = useState("");
  const [school_description, setSchoolDescription] = useState("");
  const [image_path, setImagePath] = useState(null);
  const [errors, setErrors] = useState({});
  const validate = () => {
    const err = {};
    if (!school_name.trim()) err.school_name = "School name is required";
    if (!school_description.trim())
      err.school_description = "Description is required";
    if (!image_path) err.image_path = "Image is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit2 = async () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append("school_name", school_name);
    formData.append("school_description", school_description);
    formData.append("image_path", image_path);

    try {
      setLoading(true);
      await dispatch(addSchoolInfo({ formData, token }));
      await dispatch(get_school(token));
      toast.success("Image added successfully", {
        position: "top-right",
        theme: "dark",
        transition: Zoom,
        autoClose: 3000,
      });
      setSchoolName("");
      setSchoolDescription("");
      setImagePath(null);
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to add image";
      toast.error(errorMessage, {
        position: "top-right",
        theme: "dark",
        transition: Zoom,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(get_school(token));
      } catch {
        setError("Failed to fetch school data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, token]);

  useEffect(() => {
    if (school?.schoolImages?.length) {
      const formatted = school.schoolImages.map((img) => ({
        id: img.id,
        title: img.school_name || "",
        description: img.school_description || "",
        images: img.image_path
          ? [
              {
                id: img.id,
                url: `${base_img_url}viewimagefromazure?filePath=${img.image_path}`,
                file: null,
              },
            ]
          : [],
        errors: {},
      }));
      setFormData(formatted);
    }
  }, [school]);

  const handleInputChange = (index, field, value) => {
    const updated = [...formData];
    updated[index][field] = value;
    updated[index].errors[field] = "";
    setFormData(updated);
  };

  const handleImageChange = (index, event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));

    const updated = [...formData];
    updated[index].images = [...imageUrls];
    updated[index].errors.images = "";
    setFormData(updated);
  };

  const validateForm = (index) => {
    const form = formData[index];
    const errors = {};
    if (!form.title.trim()) errors.title = "Title is required.";
    if (!form.description.trim())
      errors.description = "Description is required.";
    if (!form.images.length) errors.images = "At least one image is required.";
    const updated = [...formData];
    updated[index].errors = errors;
    setFormData(updated);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (index) => {
    if (!validateForm(index)) return;

    const form = formData[index];
    const fileInput = document.getElementById(`upload-logo-${index}`);
    const formPayload = new FormData();

    formPayload.append("id", form.id);
    formPayload.append("school_name", form.title);
    formPayload.append("school_description", form.description);

    if (fileInput && fileInput.files.length > 0) {
      formPayload.append("image_path", fileInput.files[0]);
    }

    try {
      setLoading(true);
      await dispatch(
        updateSchoolInfo({ formData: formPayload, token })
      ).unwrap();

      toast.success("School info updated successfully", {
        position: "top-right",
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
      await dispatch(get_school(token));
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to update school info please try again";

      toast.error(errorMessage, {
        position: "top-right",
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute animate-spin h-20 w-20 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <img src={logo} alt="Loading" className="h-16 w-16 rounded-full" />
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h1 className="text-2xl sm:text-2xl md:text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          Manage School Images
        </h1>

        {formData.length === 0 ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add New Image</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add School Image</DialogTitle>
                <DialogDescription>
                  Fill out the form below to add a new image.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <Label>School Name</Label>
                  <Input
                    value={school_name}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                  {errors.school_name && (
                    <p className="text-red-500 text-sm">{errors.school_name}</p>
                  )}
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={school_description}
                    onChange={(e) => setSchoolDescription(e.target.value)}
                  />
                  {errors.school_description && (
                    <p className="text-red-500 text-sm">
                      {errors.school_description}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Upload Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImagePath(e.target.files[0])}
                  />
                  {errors.image_path && (
                    <p className="text-red-500 text-sm">{errors.image_path}</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button onClick={handleSubmit2} disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <div>
            {formData.length > 0 ? (
              formData.map((form, index) => (
                <Card
                  key={index}
                  className="border shadow-lg dark:shadow-lg dark:shadow-blue-500/30 rounded-xl bg-white dark:bg-gray-900"
                >
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
                      School Image Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label
                        htmlFor="title"
                        className="text-gray-700 dark:text-white"
                      >
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={form.title}
                        onChange={(e) =>
                          handleInputChange(index, "title", e.target.value)
                        }
                        className="mt-1"
                      />
                      {form.errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="description"
                        className="text-gray-700 dark:text-white"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="mt-1"
                      />
                      {form.errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.errors.description}
                        </p>
                      )}
                    </div>

                    <div className="relative w-36 h-36 rounded-xl overflow-hidden border shadow-lg ">
                      {form.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.url}
                          alt={`Upload ${idx}`}
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://via.placeholder.com/80?text=Image";
                          }}
                        />
                      ))}
                    </div>
                    {form.errors.images && (
                      <p className="text-red-500 text-sm">
                        {form.errors.images}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <label htmlFor={`upload-logo-${index}`}>
                      <input
                        id={`upload-logo-${index}`}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleImageChange(index, e)}
                      />
                      <Button variant="outline" asChild>
                        <span>Upload Logo</span>
                      </Button>
                    </label>
                    <Button
                      onClick={() => handleSubmit(index)}
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Submit"}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <No_data_found />
            )}
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default AddSchoolImg;
