import { verifyUser } from "@/api/auth";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

export function useVerifyViewModel() {
  const { showToast } = useToast();
  const router = useRouter();

  const onVerify = async (token: string) => {
    try {
      const res = await verifyUser(token);
      if (res?.status === 200) {
        setTimeout(() => {}, 100);

        showToast("Verifikasi User Sukses", "SUCCESS");
        router.push("/login");
      }
    } catch (error: any) {
      showToast(error.message, "ERROR");
    }
  };

  return {
    onVerify,
  };
}
