"use client"
import { yupResolver } from "@hookform/resolvers/yup";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { register } from "@/api/auth";
import { Field } from "@/components/Common/Form/Form";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

export const registerSchema = yup.object({
  email: yup.string().required("* Email wajib diisi"),
  name: yup.string().required("* Nama wajib diisi"),
  role: yup.string().required("* Role wajib diisi"),
  password: yup.string().required("* Password wajib diisi"),
});

export type registerFormValues = yup.InferType<typeof registerSchema>;

export const useregisterForm = () => {
  return useForm<registerFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "SALES",
      password: "",
    },
    mode: "onChange",
    reValidateMode: "onBlur",
  });
};

export function useregisterViewModel() {
  const { showToast } = useToast();
  const router = useRouter();

  const form = useregisterForm();
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const registerFields: Field<registerFormValues>[] = [
    {
      name: "email",
      label: "Email",
      type: "text",
      placeholder: "Masukkan email",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Masukkan nama",
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      placeholder: "Pilih role",
      options: [
        { value: "SALES", label: "Sales" },
        { value: "ADMIN", label: "Admin" },
      ],
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Masukkan passwordmu",
    },
  ];

  const onSubmit: SubmitHandler<registerFormValues> = async (data) => {
    try {
      const res = await register({ email: data.email, name: data.name, password: data.password, role: data.role });
      if (res?.status === 201) {
        setTimeout(() => {}, 100);

        showToast(res.message ?? "pendaftaran akun Sukses", "SUCCESS");
        router.push("/");
      }
    } catch (error: any) {
      showToast(error.message, "ERROR");
    }
  };

  return {
    form: {
      ...form,
      handleSubmit,
    },
    onSubmit,
    isLoading: isSubmitting,
    registerFields,
    isValid,
  };
}
