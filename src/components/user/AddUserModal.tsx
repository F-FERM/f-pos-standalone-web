"use client";

import FormCombobox, { selectType } from "@/src/components/form/FormCombobox";
import FormInput from "@/src/components/form/FormInput";
import FormPhoneNumberInput from "@/src/components/form/FormPhoneNumberInput";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";

export type UserFormValues = {
  userName: string;
  accessName: string;
  pin: string;
  phone: string;
  countryCode: string;
  permission: string;
  confirmPin: string;
};

export type NewUserInput = {
  userName: string;
  accessName: string;
  pin: string;
  phone: string;
  countryCode: string;
  permission: string;
};

const emptyForm: UserFormValues = {
  userName: "",
  accessName: "",
  pin: "",
  phone: "",
  countryCode: "+91",
  permission: "",
  confirmPin: "",
};

const PERMISSION_OPTIONS: selectType[] = [
  { label: "Admin", value: "Admin" },
  { label: "Manager", value: "Manager" },
  { label: "Cashier", value: "Cashier" },
  { label: "Kitchen Staff", value: "Kitchen Staff" },
];

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: NewUserInput) => void;
};

// shared visual style for the two field cards
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

export default function AddUserModal({ isOpen, onClose, onAdd }: AddUserModalProps) {
  const methods = useForm<UserFormValues>({ defaultValues: emptyForm });

  if (!isOpen) return null;

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    if (!values.userName || !values.userName.trim()) return;
    if (!values.pin || values.pin !== values.confirmPin) return;

    onAdd({
      userName: values.userName.trim(),
      accessName: values.accessName.trim(),
      pin: values.pin,
      phone: String(values.phone || "").trim(),
      countryCode: values.countryCode || "+91",
      permission: values.permission,
    });

    methods.reset(emptyForm);
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-[2px]">
      <FormProvider {...methods}>
        <div
          className="absolute"
          style={{
            top: 204,
            left: 106,
            width: 812,
            height: 430,
            borderRadius: 20,
            border: "1px solid #A6A6A6",
            background: "#E9E9E9",
            paddingTop: 26,
            paddingRight: 34,
            paddingBottom: 26,
            paddingLeft: 34,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            boxShadow: "0 0 30px rgba(0,0,0,0.35)",
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg"
            aria-label="Close add user modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <h3
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: 22,
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#000000",
            }}
            className="mb-2"
          >
            Add User
          </h3>

          {/* Two field cards side by side */}
          <div style={{ display: "flex", gap: 12 }}>
            {/* Card 1: User Name, Access Name, PIN */}
            <div style={fieldCardStyle}>
              <label className="block">
                <FormInput name="userName" placeholder="Enter User Name" label="User Name" />
              </label>

              <label className="block">
                <FormInput name="accessName" placeholder="Enter Access Name" label="Access Name" />
              </label>

              <label className="block">
                <FormInput name="pin" type="password" placeholder="Enter PIN" label="PIN" />
              </label>
            </div>

            {/* Card 2: Phone No, Select Permission, Confirm PIN */}
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
                  name="permission"
                  placeholder="Select or search"
                  options={PERMISSION_OPTIONS}
                  label="Select Permission"
                />
              </label>

              <label className="block">
                <FormInput
                  name="confirmPin"
                  type="password"
                  placeholder="Enter Confirm PIN"
                  label="Confirm PIN"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="add" size="none" onClick={handleSubmit}>
              ADD
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
