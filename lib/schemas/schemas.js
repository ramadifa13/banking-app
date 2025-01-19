import * as yup from "yup";

export const loginSchema = yup
  .object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  })
  .required();
  
 export const registerSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    name: yup.string().required("Name is required"),
    cifNumber: yup
      .string()
      .matches(/^\d{10}$/, "CIF Number must be 10 digits")
      .required("CIF Number is required"),
    address: yup.string().required("Address is required"),
    dob: yup.date().required("Date of birth is required"),
    phoneNumber: yup.string().required( "Phone number is required"),
  });
  