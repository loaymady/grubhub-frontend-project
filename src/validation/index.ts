import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Post name is required")
    .min(3, "Post name must be at least 3 characters")
    .max(20, "Post name cannot exceed 20 characters"),
  description: Yup.string()
    .required("Post description is required")
    .min(20, "Post description must be at least 20 characters"),
  order: Yup.number().min(1, "Order must be greater than 0"),
});
