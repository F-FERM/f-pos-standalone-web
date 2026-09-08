import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { LoginPayload } from "@/src/interfaces/login/LoginPayload";
import { UserLogin } from "../api/api";
import { LoginResponse } from "@/src/interfaces/login/LoginResponse";
import { LocalStorage } from "@/src/utility/localStorage";
import { CustomError } from "@/src/interfaces/error/CustomError";

export const useLogin = () => {
  const router = useRouter();
  const toastDuration = 2000;
  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const payload: LoginPayload = {
        username: data.username,
        password: data.password,
      };
      return await UserLogin(payload);
    },
    onSuccess: (data: LoginResponse) => {
      toast.success("Login Successfully", {
        duration: toastDuration,
      });

      LocalStorage.setItem("access_token", data.access_token);
      router.push("/home");
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage =
        errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};
