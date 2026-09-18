"use client";

import FormInput from "@/src/components/form/FormInput";
import FormCombobox from "@/src/components/form/FormCombobox";
import FormTextArea from "@/src/components/form/FormTextArea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

import { useAddAccount } from "@/src/api/account/hooks/create.hook";
import { useUpdateAccount } from "@/src/api/account/hooks/update.hook";
import { ListAccountByIdApi } from "@/src/api/account/api/GetById";
import { ListAccountApi } from "@/src/api/account/api/GetAll";
import { useQuery } from "@tanstack/react-query";
import { ACCOUNT_TYPE_OPTIONS } from "@/src/interfaces/accounts/AddAccountPayload";

const accountSchema = z.object({
  accountName: z.string().min(1, "Account name is required").max(150),
  accountType: z.string().min(1, "Account type is required"),
  parentAccountId: z.string().optional().or(z.literal("")),
  showInPos: z.boolean().optional(),
  description: z.string().max(500).optional().or(z.literal("")),
  openingBalance: z
    .number({ error: "Opening balance must be a number" })
    .optional(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;

const emptyForm: AccountFormValues = {
  accountName: "",
  accountType: "",
  parentAccountId: "",
  showInPos: false,
  description: "",
  openingBalance: 0,
};

type AddAccountModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  accountId?: string;
};

export default function AddAccountModal({
  isOpen,
  onClose,
  mode = "add",
  accountId,
}: AddAccountModalProps) {
  const isEdit = mode === "edit";

  const form = useForm<AccountFormValues>({
    defaultValues: emptyForm,
    resolver: zodResolver(accountSchema),
  });

  const showInPos = form.watch("showInPos");

  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const { data: accountData } = useQuery({
    queryKey: ["getAccountById", accountId],
    queryFn: () => ListAccountByIdApi(String(accountId)),
    enabled: isEdit && !!accountId,
  });

  
  const { data: parentAccountListData } = useQuery({
    queryKey: ["getAllAccounts", "parent-options"],
    queryFn: () => ListAccountApi({ page: 1, limit: 100 }),
    enabled: isOpen,
  });

  const parentAccountOptions = useMemo(() => {
    const accounts = parentAccountListData?.data ?? [];
    return accounts
      .filter((account) => account._id !== accountId)
      .map((account) => ({
        label: account.accountName,
        value: account._id,
      }));
  }, [parentAccountListData, accountId]);

  const { mutate: addAccount, isPending: isAdding } = useAddAccount({
    form,
    onOpenChange,
  });
  const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount({
    form,
    onOpenChange,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && accountData) {
      form.reset({
        accountName: accountData.data.accountName,
        accountType: accountData.data.accountType,
        parentAccountId: accountData.data.parentAccountId ?? "",
        showInPos: accountData.data.showInPos,
        description: accountData.data.description,
        openingBalance: accountData.data.openingBalance,
      });
      return;
    }

    if (!isEdit) form.reset(emptyForm);
  }, [isEdit, accountData, isOpen, form]);

  function handleClose() {
    form.reset(emptyForm);
    onClose();
  }

  const handleSubmit = form.handleSubmit((values) => {
    const payload = {
      accountName: values.accountName.trim(),
      accountType: values.accountType,
      parentAccountId: values.parentAccountId?.trim() || "",
      showInPos: !!values.showInPos,
      description: String(values.description || "").trim(),
      openingBalance: values.openingBalance ?? 0,
    };

    if (isEdit && accountId) {
      updateAccount({ id: accountId, value: payload });
    } else {
      addAccount(payload);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="
          w-[812px] max-w-[calc(100vw-2rem)]
          h-auto min-h-[583px]
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
          aria-label="Close add account modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div>
          <DialogTitle className="text-[22px] font-semibold text-black">
            {isEdit ? "Edit Account" : "Add Account"}
          </DialogTitle>
        </div>

        <FormProvider {...form}>
          <div className="space-y-[14px]">
            <label className="block">
              <FormInput
                name="accountName"
                placeholder="Enter Account Name"
                label="Account Name"
                required
              />
            </label>

            <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
              <FormCombobox
                name="accountType"
                label="Account Type"
                options={ACCOUNT_TYPE_OPTIONS}
                placeholder="Select Or search"
                required
              />

              <FormCombobox
                name="parentAccountId"
                label="Parent Account"
                options={parentAccountOptions}
                placeholder="Select Or search"
              />
            </div>

            <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
              <label className="block">
                <FormInput
                  name="openingBalance"
                  type="number"
                  label="Opening Balance"
                />
              </label>

              <div className="flex items-end pb-[8px]">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[#A1A1A1] font-medium sm:text-base">
                  <span
                    onClick={() => form.setValue("showInPos", !showInPos)}
                    className={`flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-black ${
                      showInPos ? "border-[#450042] bg-[#450042]" : "border-black bg-[#E9E9E9]"
                    }`}
                  >
                    {showInPos && <Check size={12} strokeWidth={3} className="text-white" />}
                  </span>
                  Show In POS
                </label>
              </div>
            </div>

            <label className="block">
              <FormTextArea
                name="description"
                placeholder="Enter Description"
                label="Description"
              />
            </label>
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