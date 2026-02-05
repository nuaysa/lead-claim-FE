import { yupResolver } from "@hookform/resolvers/yup";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { Field } from "@/components/Common/Form/Form";
import { useToast } from "@/contexts/ToastContext";
import { resetPassword } from "@/api/auth";
import { useRouter } from "next/navigation";

export const ResetPasswordSchema = yup.object({
  password: yup.string().required("* Password wajib diisi"),
  confirmPassword: yup
    .string()
    .required("* Password wajib diisi")
    .oneOf([yup.ref("password")], "* Password tidak sama"),
});

export type ResetPasswordFormValues = yup.InferType<typeof ResetPasswordSchema>;

export const useResetPasswordForm = () => {
  return useForm<ResetPasswordFormValues>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
    reValidateMode: "onBlur",
  });
};

export function useResetPasswordViewModel() {
  const { showToast } = useToast();
  const router = useRouter();
  const form = useResetPasswordForm();
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const ResetPasswordFields: Field<ResetPasswordFormValues>[] = [
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Masukkan passwordmu",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      customWidth: "w-full",
      placeholder: "Masukkan lagi passwordmu",
    },
  ];

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    try {
      const res = await resetPassword({ password: data.password, confirmPassword: data.confirmPassword });
      if (res?.status === 200) {
        setTimeout(() => {}, 100);

        showToast(res.message ?? "Reset Password Sukses", "SUCCESS");
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
    ResetPasswordFields,
    isValid,
  };
}
