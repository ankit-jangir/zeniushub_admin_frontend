import React, { useState } from 'react';
import Header from '../../Dashboard/Header';
import { SidebarInset, SidebarProvider } from '../../../src/components/ui/sidebar';
import AppSidebar from '../../../src/components/ui/app-sidebar';
import { ArrowLeft, Book, Users, GraduationCap, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../../../src/components/ui/button';

const MarksheetForm = () => {
  const [marksheetName, setMarksheetName] = useState('');
  const [course, setCourse] = useState('');
  const [batch, setBatch] = useState('');
  const [student, setStudent] = useState('');
  const [exam, setExam] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!marksheetName.trim()) newErrors.marksheetName = 'Marksheet Name is required';
    if (!course) newErrors.course = 'Course is required';
    if (!batch) newErrors.batch = 'Batch is required';
    if (!student) newErrors.student = 'Student is required';
    if (!exam) newErrors.exam = 'Exam is required';
    return newErrors;
  };

  // Function to reset form fields
  const resetForm = () => {
    setMarksheetName('');
    setCourse('');
    setBatch('');
    setStudent('');
    setExam('');
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Log the data and reset form on successful submission
    console.log({ marksheetName, course, batch, student, exam });
    resetForm();
  };

  const clearError = (fieldName, value) => {
    if (errors[fieldName] && value) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const inputClass =
    'w-full border border-gray-200 rounded-lg h-12 px-10  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 placeholder-black';
  const labelClass = 'block font-medium text-lg mb-2 flex items-center gap-2 ';
  const iconClass = 'text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2';
  const errorClass = 'text-red-500 text-sm mt-1 border border-red-300';
  const navigate = useNavigate();

  return (
    <SidebarProvider style={{ '--sidebar-width': '15rem' }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex items-center gap-4 p-4 border-b shadow-sm">
          <Button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full flex items-center gap-2 transition duration-300 shadow-md"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            <span className="hidden md:inline">Back to Student</span>
          </Button>
          <h2 className="text-2xl font-semibold tracking-tight">Marksheet</h2>
        </div>

        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <div className="w-full max-w-xl rounded-2xl shadow-md shadow-blue-500/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Marksheet Name */}
              <div className="relative">
                <label htmlFor="marksheetName" className={`${labelClass} `}>
                  <FileText size={18} /> Marksheet Name *
                </label>
                <input
                  type="text"
                  id="marksheetName"
                  value={marksheetName}
                  onChange={(e) => {
                    setMarksheetName(e.target.value);
                    clearError('marksheetName', e.target.value.trim());
                  }}
                  className={`${inputClass} text-black ${errors.marksheetName ? 'border-red-500' : ''}`}
                  placeholder="e.g., Semester 1 Results"
                />
                {errors.marksheetName && <p className={errorClass}>{errors.marksheetName}</p>}
              </div>

              {/* Course */}
              <div className="relative">
                <label htmlFor="course" className={labelClass}>
                  <Book size={18} /> Course *
                </label>
                <select
                  id="course"
                  value={course}
                  onChange={(e) => {
                    setCourse(e.target.value);
                    clearError('course', e.target.value);
                  }}
                  className={`${inputClass} text-black ${errors.course ? 'border-red-500' : ''}`}
                >
                  <option value="" className="text-black">
                    Select Course
                  </option>
                  <option value="course1" className="text-black">
                    Course 1
                  </option>
                  <option value="course2" className="text-black">
                    Course 2
                  </option>
                  <option value="course3" className="text-black">
                    Course 3
                  </option>
                </select>
                {errors.course && <p className={errorClass}>{errors.course}</p>}
              </div>

              {/* Batch */}
              <div className="relative">
                <label htmlFor="batch" className={labelClass}>
                  <Users size={18} /> Batch *
                </label>
                <select
                  id="batch"
                  value={batch}
                  onChange={(e) => {
                    setBatch(e.target.value);
                    clearError('batch', e.target.value);
                  }}
                  className={`${inputClass} text-black ${errors.batch ? 'border-red-500' : ''}`}
                >
                  <option className="text-black" value="">
                    Select Batch
                  </option>
                  <option className="text-black" value="batch1">
                    Batch 1
                  </option>
                  <option className="text-black" value="batch2">
                    Batch 2
                  </option>
                  <option className="text-black" value="batch3">
                    Batch 3
                  </option>
                </select>
                {errors.batch && <p className={errorClass}>{errors.batch}</p>}
              </div>

              {/* Student */}
              <div className="relative">
                <label htmlFor="student" className={labelClass}>
                  <GraduationCap size={18} /> Student *
                </label>
                <select
                  id="student"
                  value={student}
                  onChange={(e) => {
                    setStudent(e.target.value);
                    clearError('student', e.target.value);
                  }}
                  className={`${inputClass} text-black ${errors.student ? 'border-red-500' : ''}`}
                >
                  <option className="text-black" value="">
                    Select Student
                  </option>
                  <option className="text-black" value="student1">
                    Student 1
                  </option>
                  <option className="text-black" value="student2">
                    Student 2
                  </option>
                  <option className="text-black" value="student3">
                    Student 3
                  </option>
                </select>
                {errors.student && <p className={errorClass}>{errors.student}</p>}
              </div>

              {/* Exam */}
              <div className="relative">
                <label htmlFor="exam" className={labelClass}>
                  <Book size={18} /> Exam *
                </label>
                <select
                  id="exam"
                  value={exam}
                  onChange={(e) => {
                    setExam(e.target.value);
                    clearError('exam', e.target.value);
                  }}
                  className={`${inputClass} text-black ${errors.exam ? 'border-red-500' : ''}`}
                >
                  <option className="text-black" value="">
                    Select Exam
                  </option>
                  <option className="text-black" value="exam1">
                    Exam 1
                  </option>
                  <option className="text-black" value="exam2">
                    Exam 2
                  </option>
                  <option className="text-black" value="exam3">
                    Exam 3
                  </option>
                </select>
                {errors.exam && <p className={errorClass}>{errors.exam}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full max-w-xs py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MarksheetForm;
