"use client";

import FormInput from "@/src/components/form/FormInput";
import FormPhoneNumberInput from "@/src/components/form/FormPhoneNumberInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

import { useAddUser } from "@/src/api/user/hooks/create.hook";
import { useUpdateUser } from "@/src/api/user/hooks/update.hook";
import { ListUserByIdApi } from "@/src/api/user/api/GetById";
import { useQuery } from "@tanstack/react-query";

const userSchema = z
  .object({
    firstName: z.string().min(1, "User name is required").max(150),
    username: z.string().min(1, "Access name is required").max(150),
    email: z.string().email("Enter a valid email").min(1, "Email is required"),
    phone: z.string().max(20, "Phone number looks too long").optional().or(z.literal("")),
    countryCode: z.string().optional(),
    password: z.string().min(4, "PIN must be at least 4 characters"),
    confirmPassword: z.string().min(1, "Please confirm the PIN"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "PINs do not match",
    path: ["confirmPassword"],
  });

export type UserFormValues = z.infer<typeof userSchema>;

const emptyForm: UserFormValues = {
  firstName: "",
  username: "",
  email: "",
  phone: "",
  countryCode: "+91",
  password: "",
  confirmPassword: "",
};

import { Country } from "country-state-city";

function getPhoneParts(phone: string) {
  const allCountries = Country.getAllCountries();
  // Sort by length of phonecode descending so we match +971 before +9
  const sortedCodes = Array.from(new Set(allCountries.map((c) => `+${c.phonecode}`))).sort((a, b) => b.length - a.length);
  
  const countryCode = sortedCodes.find((c) => phone.startsWith(c)) || "+91";
  return {
    countryCode,
    phone: phone.startsWith(countryCode)
      ? phone.slice(countryCode.length)
      : phone.replace(/\D/g, ""),
  };
}

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  userId?: string;
};

export default function AddUserModal({
  isOpen,
  onClose,
  mode = "add",
  userId,
}: AddUserModalProps) {
  const isEdit = mode === "edit";

  const form = useForm<UserFormValues>({
    defaultValues: emptyForm,
    resolver: zodResolver(userSchema),
  });

  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const { data: userData } = useQuery({
    queryKey: ["getUserById", userId],
    queryFn: () => ListUserByIdApi(String(userId)),
    enabled: isEdit && !!userId,
  });

  const { mutate: addUser, isPending: isAdding } = useAddUser({
    form,
    onOpenChange,
  });
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser({
    form,
    onOpenChange,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && userData) {
      const { countryCode, phone } = getPhoneParts(userData.data.phone);
      form.reset({
        firstName: userData.data.firstName,
        username: userData.data.username,
        email: userData.data.email,
        phone,
        countryCode,
        password: "",
        confirmPassword: "",
      });
      return;
    }

    if (!isEdit) form.reset(emptyForm);
  }, [isEdit, userData, isOpen, form]);

  function handleClose() {
    form.reset(emptyForm);
    onClose();
  }

  const handleSubmit = form.handleSubmit((values) => {
    const payload = {
      username: values.username.trim(),
      firstName: values.firstName.trim(),
      password: values.password,
      email: values.email.trim(),
      phone: values.phone?.trim() ? `${values.countryCode ?? ""}${values.phone.trim()}` : "",
    };

    if (isEdit && userId) {
      updateUser({ id: userId, value: payload });
    } else {
      addUser(payload);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="
          w-[812px] max-w-[calc(100vw-2rem)]
          h-auto min-h-[420px]
          flex flex-col gap-[10px]
          rounded-[20px] border-[1px]
          bg-[#E9E9E9] text-white
          pt-[26px] pr-[34px] pb-[26px] pl-[34px]
          opacity-100 shadow-[0_0_30px_rgba(0,0,0,0.35)]
        "
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg"
          aria-label="Close add user modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div>
          <DialogTitle className="text-[22px] font-semibold text-black">
            {isEdit ? "Edit User" : "Add User"}
          </DialogTitle>
        </div>

        <FormProvider {...form}>
          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
            <div className="flex flex-col gap-[14px] rounded-[10px] border-[1px] border-[#B5B5B5] bg-[#E9E9E9] p-[10px]">
              <label className="block">
                <FormInput name="firstName" placeholder="Enter User Name" label="User Name" required />
              </label>

              <label className="block">
                <FormInput name="username" placeholder="Enter Access Name" label="Access Name" required />
              </label>

              <label className="block">
                <FormInput name="password" type="password" placeholder="Enter PIN" label="PIN" required />
              </label>
            </div>

            <div className="flex flex-col gap-[14px] rounded-[10px] border-[1px] border-[#B5B5B5] bg-[#E9E9E9] p-[10px]">
              <label className="block">
                <FormPhoneNumberInput
                  name="phone"
                  label="Phone No"
                  countryCode={form.watch("countryCode")}
                  onChange={(phone: string, country: string) => {
                    form.setValue("phone", phone);
                    form.setValue("countryCode", country);
                  }}
                />
              </label>

              <label className="block">
                <FormInput name="email" type="email" placeholder="Enter Email" label="Email" required />
              </label>

              <label className="block">
                <FormInput
                  name="confirmPassword"
                  type="password"
                  placeholder="Enter Confirm PIN"
                  label="Confirm PIN"
                  required
                />
              </label>
            </div>
          </div>

          <div className="mt-[22px] flex justify-end">
            <Button
              type="button"
              variant="add"
              size="none"
              onClick={handleSubmit}
              disabled={isEdit ? isUpdating : isAdding}
            >
              {isEdit ? "SAVE" : "ADD"}
            </Button>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}