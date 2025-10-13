import { createSlice } from "@reduxjs/toolkit";
import {
  addStudent,
  addStudentsExcel,
  check,
  getSingleStudent,
  getStudentRecipients,
  getStudents,
  getStudentsCoursesFees,
  updateStudent,
  updateStudentsRt,
  updateStudentStatus,
} from "../Api/StudentsApiStore";

const initialState = {
  students: [],
  updateStudentStatus: {},
  statusUpdated: false,
  recipients: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  newStudent: {
    course_id: null,
    batch_id: null,
    name: "",
    address: "",
    adhar_no: "",
    contact_no: "",
    father_name: "",
    mother_name: "",
    // parent_adhar_no:"",
    // parent_account_no:"",
    // pancard_no:"",
    // ifsc_no:"",
    // ex_school:"",
    dob: "",
    joining_date: "",
    gender: "",
    // adhar_front_back:"",
    // pancard_front_back:"",
    profile_image: null,
  },
  profile_image: null,
};

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    updateNewStudent: (state, action) => {
      state.newStudent = {
        ...state.newStudent,
        ...action.payload,
      };
    },

    setProfileImage: (state, action) => {
      state.profile_image = action.payload;
    },

    resetNewStudent: (state) => {
      state.newStudent = {
        course_id: null,
        batch_id: null,
        name: "",
        address: "",
        adhar_no: "",
        contact_no: "",
        father_name: "",
        mother_name: "",
        dob: "",
        joining_date: "",
        gender: "",
        profile_image: "",
        
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students || [];
        state.total = action.payload.total || 0;
        state.currentPage = action.payload.currentPage || 1;
        state.name = action.payload.name || "";
      })
      .addCase(getStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch students";
      });

    builder
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;

        if (!Array.isArray(state.students)) {
          state.students = [];
        }
        state.students.push(action.payload.student);
        state.newStudent = {
          course_id: null,
          batch_id: null,
          name: "",
          address: "",
          adhar_no: "",
          contact_no: "",
          father_name: "",
          mother_name: "",
          dob: "",
          joining_date: "",
          gender: "",
          profile_image: "",
        };
        state.profile_image  = null;
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add student";
      });

    builder
      .addCase(addStudentsExcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudentsExcel.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.students) {
          state.students = [...state.students, ...action.payload.students];
        }
      })
      .addCase(addStudentsExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to upload Excel file";
      });

    builder
      .addCase(updateStudentsRt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentsRt.fulfilled, (state, action) => {
        state.loading = false;
        const updatedStudent = action.payload.student;
        state.students = state.students.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student
        );
      })
      .addCase(updateStudentsRt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update student";
      });
    builder
      .addCase(updateStudentStatus.pending, (state) => {
        state.loading = true;
        state.statusUpdated = false;
        state.error = null;
      })
      .addCase(updateStudentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.statusUpdated = true;
        state.error = null;
      })
      .addCase(updateStudentStatus.rejected, (state, action) => {
        state.loading = false;
        state.statusUpdated = false;
        state.error = action.payload || "Something went wrong";
      });

    builder
      .addCase(getStudentRecipients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentRecipients.fulfilled, (state, action) => {
        state.loading = false;
        state.recipients = action.payload.recipients || [];
      })
      .addCase(getStudentRecipients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch student recipients";
      });

    builder
      .addCase(getSingleStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.Profile = action.payload;
      })

      .addCase(getSingleStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch single student";
      });

    builder
      .addCase(getStudentsCoursesFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentsCoursesFees.fulfilled, (state, action) => {
        state.loading = false;
        state.studentCoursesFees = action.payload; // Store the fetched data
      })
      .addCase(getStudentsCoursesFees.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch student courses and fees";
      });
    builder;
    builder
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.Profile.data = action.payload; // Update Profile with new data
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(check.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(check.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(check.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.data = null;
      });
  },
});

export const {
  resetError,
  updateNewStudent,
  resetNewStudent,
  setProfileImage,
} = studentSlice.actions;
export default studentSlice.reducer;
