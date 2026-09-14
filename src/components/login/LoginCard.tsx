"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import LoginFormCombobox from "@/src/components/form/LoginFormCombobox";
import LoginFormInput from "@/src/components/form/LoginFormInput";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { useLogin } from "@/src/api/login/hooks/hook";
import { ListUserApi } from "@/src/api/user/api/GetAll";
import { ListUserByIdApi } from "@/src/api/user/api/GetById";
import LoginPinKeypad from "./LoginPinKeyPad";
import { useState } from "react";

const MAX_PIN_LENGTH = 6;

const loginSchema = z.object({
  role: z.string().min(1, "User is required"),
  pin: z
    .string()
    .min(4, "PIN must be at least 4 digits")
    .max(MAX_PIN_LENGTH, `PIN can't exceed ${MAX_PIN_LENGTH} digits`),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginCard() {
  const [search, setSearch] = useState("");
  const { mutate: userLogin, isPending } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "", pin: "" },
    mode: "onChange",
  });
  const pin = form.watch("pin");
  const selectedUserId = form.watch("role");

  const { data: userListData, isLoading: isUserListLoading } = useQuery({
    queryKey: ["getAllUsers", search],
    queryFn: () =>
      ListUserApi({
        search,
        page: 1,
        limit: 100,
      }),
  });

  const { data: userData,  } = useQuery({
    queryKey: ["getUserById", selectedUserId],
    queryFn: () => ListUserByIdApi(selectedUserId),
    enabled: !!selectedUserId,
  });

  const userOptions =
    userListData?.data?.map((user: { _id: string; username: string }) => ({
      value: user._id,
      label: user.username,
    })) ?? [];

  const selectedUserLabel = userData?.data?.username ?? "";

  const handleDigit = (digit: string) => {
    const current = form.getValues("pin");
    if (current.length >= MAX_PIN_LENGTH) return;
    form.setValue("pin", current + digit, { shouldValidate: true });
  };
  const handleBackspace = () =>
    form.setValue("pin", form.getValues("pin").slice(0, -1), { shouldValidate: true });
  const handleClear = () => form.setValue("pin", "", { shouldValidate: true });

  const onSubmit = (values: LoginFormValues) =>
    userLogin({ userId: values.role, password: values.pin });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-[427px] min-h-[460px] sm:min-h-[500px] md:min-h-[539px] shrink-0 flex-col rounded-[20px]
          border border-white/40 bg-white/8 pt-5 sm:pt-6 px-4 sm:px-5 md:px-[31px] pb-[15px] shadow-2xl backdrop-blur-[2px]"
      >
        <h1 className="mb-[14px] sm:mb-[18px] text-center font-[Poppins,sans-serif] text-[24px] sm:text-[28px] md:text-[32px] font-semibold leading-none text-white">
          Login
        </h1>

        <LoginFormCombobox
          name="role"
          placeholder={isUserListLoading ? "Loading users..." : "Select user"}
          options={userOptions}
          disabled={isUserListLoading}
          setSearch={setSearch}
          valueLabel={selectedUserLabel}
          className="mb-[10px]"
        />

        <LoginFormInput
          name="pin"
          type="password"
          value={pin}
          placeholder="Enter PIN using keypad"
          className="mb-[10px]"
        />

        <LoginPinKeypad
          disabled={isPending}
          onDigit={handleDigit}
          onClear={handleClear}
          onBackspace={handleBackspace}
        />

        <Button type="submit" disabled={pin.length === 0 || isPending} variant="login" className="mt-auto">
          {isPending ? "Logging in…" : "LOGIN"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}