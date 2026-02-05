import { yupResolver } from "@hookform/resolvers/yup";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { login } from "@/api/auth";
import { useAuthContext } from "@/contexts/AuthContext";
import { Field } from "@/components/Common/Form/Form";
import { useToast } from "@/contexts/ToastContext";

export const loginSchema = yup.object({
  data: yup.string().required("* Email/Nama wajib diisi"),
  password: yup.string().required("* Password wajib diisi"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const useLoginForm = () => {
  return useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      data: "",
      password: "",
    },
    mode: "onChange",
    reValidateMode: "onBlur",
  });
};

export function useLoginViewModel() {
  const { showToast } = useToast();
  const { afterSuccessLogin } = useAuthContext();

  const form = useLoginForm();
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const loginFields: Field<LoginFormValues>[] = [
    {
      name: "data",
      label: "Email/Nama",
      type: "text",
      placeholder: "Masukkan email/namamu",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Masukkan passwordmu",
    },
  ];

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const res = await login({ data: data.data, password: data.password });
      if (res?.status === 200) {
        afterSuccessLogin(res.token);

        setTimeout(() => {}, 100);

        showToast( res.message ?? "Login Sukses", "SUCCESS");
      }
    } catch (error : any) {
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
    loginFields,
    isValid,
  };
}
