"use client";

import FormCombobox, { selectType } from "@/src/components/form/FormCombobox";
import FormInput from "@/src/components/form/FormInput";
import FormPhoneNumberInput from "@/src/components/form/FormPhoneNumberInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

// ─── Zod schema ───────────────────────────────────────────────────────────────
const baseUserSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username must be 50 characters or less"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less"),
  lastName: z
    .string()
    .max(50, "Last name must be 50 characters or less")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z.string().max(20, "Phone number looks too long").optional().or(z.literal("")),
  countryCode: z.string().min(1, "Country code is required"),
  password: z.string().optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
  role: z.string().min(1, "Role is required"),
  isActive: z.boolean(),
});

// Add password / confirm-password cross-field validation.
// On "add" mode the page validates password required; the form schema itself
// just ensures they match whenever password is provided.
const userSchema = baseUserSchema.refine(
  (data) => !data.password || data.password === data.confirmPassword,
  { message: "Passwords do not match", path: ["confirmPassword"] },
);

export type UserFormValues = z.infer<typeof baseUserSchema>;
export type NewUserInput = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  password: string;
  role: string;
  isActive: boolean;
};

const emptyForm: UserFormValues = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  countryCode: "+91",
  password: "",
  confirmPassword: "",
  role: "",
  isActive: true,
};

const ROLE_OPTIONS: selectType[] = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "User", value: "user" },
  { label: "Kitchen Staff", value: "kitchen_staff" },
];

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: NewUserInput) => void;
  mode?: "add" | "edit";
  initialUser?: Omit<UserFormValues, "password" | "confirmPassword"> | null;
};

const fieldCardStyle: React.CSSProperties = {
  flex: 1,
  borderRadius: 10,
  border: "1px solid #B5B5B5",
  background: "#E9E9E9",
  padding: 10,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

export default function AddUserModal({
  isOpen,
  onClose,
  onAdd,
  mode = "add",
  initialUser = null,
}: AddUserModalProps) {
  const methods = useForm<UserFormValues>({
    defaultValues: emptyForm,
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (!isOpen) return;
    methods.reset(
      initialUser
        ? { ...initialUser, password: "", confirmPassword: "" }
        : emptyForm,
    );
  }, [initialUser, isOpen, methods]);

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = methods.handleSubmit(
    (values) => {
      // On add mode, password is required — set a form error if blank.
      if (mode === "add" && !values.password) {
        methods.setError("password", { message: "Password is required" });
        return;
      }

      onAdd({
        username: values.username.trim(),
        firstName: (values.firstName ?? "").trim(),
        lastName: (values.lastName ?? "").trim(),
        email: values.email.trim(),
        phone: String(values.phone || "").trim(),
        countryCode: values.countryCode || "+91",
        password: values.password ?? "",
        role: values.role,
        isActive: values.isActive,
      });

      methods.reset(emptyForm);
    },
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="
          w-[812px] max-w-[calc(100vw-2rem)]
          flex flex-col gap-[10px]
          rounded-[20px] border-[1px]
          bg-[#E9E9E9]
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

        <DialogTitle className="mb-2 text-[22px] font-semibold text-black">
          {mode === "edit" ? "Edit User" : "Add User"}
        </DialogTitle>

        <FormProvider {...methods}>
          <div style={{ display: "flex", gap: 12 }}>
            {/* Card 1: username, first/last name, email */}
            <div style={fieldCardStyle}>
              <label className="block">
                <FormInput
                  name="username"
                  placeholder="Enter Username"
                  label="Username"
                  required
                />
              </label>

              <label className="block">
                <FormInput
                  name="firstName"
                  placeholder="Enter First Name"
                  label="First Name"
                  required
                />
              </label>

              <label className="block">
                <FormInput
                  name="lastName"
                  placeholder="Enter Last Name"
                  label="Last Name"
                />
              </label>

              <label className="block">
                <FormInput
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  label="Email"
                  required
                />
              </label>
            </div>

            {/* Card 2: phone, role, password, confirm password, active */}
            <div style={fieldCardStyle}>
              <label className="block">
                <FormPhoneNumberInput
                  name="phone"
                  label="Phone No"
                  countryCode={methods.watch("countryCode")}
                  onChange={(phone: string, country: string) => {
                    methods.setValue("phone", phone);
                    methods.setValue("countryCode", country);
                  }}
                />
              </label>

              <label className="block">
                <FormCombobox
                  name="role"
                  placeholder="Select or search"
                  options={ROLE_OPTIONS}
                  label="Role"
                  required
                />
              </label>

              <label className="block">
                <FormInput
                  name="password"
                  type="password"
                  placeholder={
                    mode === "edit" ? "Leave blank to keep current" : "Enter Password"
                  }
                  label="Password"
                  required={mode === "add"}
                />
              </label>

              <label className="block">
                <FormInput
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  label="Confirm Password"
                  required={mode === "add"}
                />
              </label>

              <label className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#B5B5B5]"
                  {...methods.register("isActive")}
                />
                <span className="font-poppins text-[13px] font-medium text-black">
                  Active
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="add" size="none" onClick={handleSubmit}>
              {mode === "edit" ? "SAVE" : "ADD"}
            </Button>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}