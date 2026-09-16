"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import FormInput from "@/src/components/form/FormInput";
import FormCombobox from "@/src/components/form/FormCombobox";
import { Button } from "../ui/button";
import { ListCustomerApi } from "@/src/api/customer/api/GetAll";
import AddCustomerModal from "../customer/AddCustomerDialogue";



const homeDeliverySchema = z
  .object({
    customerId: z.string().optional().or(z.literal("")),
    location: z.string().optional().or(z.literal("")),
    deliveryDate: z.string().optional().or(z.literal("")),
    deliveryTime: z.string().optional().or(z.literal("")),
  })
  .transform((data) => ({
    ...data,
    // Convert "YYYY-MM-DD" + "HH:MM" → ISO 8601 (e.g. "2024-01-15T12:02:00.000Z")
    deliveryTime:
      data.deliveryDate && data.deliveryTime
        ? new Date(`${data.deliveryDate}T${data.deliveryTime}:00`).toISOString()
        : data.deliveryTime,
  }));

// Raw input type — what the form fields hold (before transform)
export type RawHomeDeliveryFormValues = z.input<typeof homeDeliverySchema>;
// Output type — what onSubmit receives (after transform, deliveryTime is ISO)
export type HomeDeliveryFormValues = z.output<typeof homeDeliverySchema>;

const emptyForm: RawHomeDeliveryFormValues = {
  customerId: "",
  location: "",
  deliveryDate: "",
  deliveryTime: "",
};

interface HomeDeliveryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: HomeDeliveryFormValues) => void;
}

export function HomeDeliveryModal({ open, onClose, onSubmit }: HomeDeliveryModalProps) {
  const methods = useForm<RawHomeDeliveryFormValues, unknown, HomeDeliveryFormValues>({
    defaultValues: emptyForm,
    resolver: zodResolver(homeDeliverySchema) as Resolver<RawHomeDeliveryFormValues, unknown, HomeDeliveryFormValues>,
  });

  const [search, setSearch] = useState("");
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  const { data: customerData } = useQuery({
    queryKey: ["getAllCustomer", search],
    queryFn: () => ListCustomerApi({ search, page: 1, limit: 100 }),
    enabled: open,
  });

  // ASSUMPTION: customer records look like { _id, name } — align `.name`
  // with your actual customer response shape.
  const customerOptions = (customerData?.data || []).map((c) => ({
    label: c.name,
    value: c._id,
  }));

  useEffect(() => {
    if (open) {
      methods.reset(emptyForm);
      setSearch("");
    }
  }, [open]);

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = methods.handleSubmit(
    (values) => {
      onSubmit(values);
      // NOTE: Do NOT reset here — resetting immediately after onSubmit causes a
      // React state-batching race where the parent's state (selectedCustomerId,
      // deliveryDetails) hasn't committed yet before the form is cleared,
      // making the payload appear empty on the first submit.
      // The useEffect above already resets the form whenever the modal reopens.
    },
    (errors) => {
      console.log("Form validation errors:", errors);
    },
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[40] flex items-center justify-center overflow-y-auto p-4 py-6 backdrop-blur-[2px] bg-black/50">
      <FormProvider {...methods}>
        <div className="relative my-auto w-[812px] max-w-[calc(100vw-2rem)]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-2 top-2 z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px]"
            aria-label="Close home delivery modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="flex max-h-[85vh] w-full flex-col gap-[16px] overflow-y-auto rounded-[20px] border border-[#A6A6A6] bg-[#E9E9E9] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px]">
            <h3 className="text-[22px] font-semibold leading-none text-black">
              Home Delivery Details
            </h3>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <FormCombobox
                  name="customerId"
                  label="Customer"
                  options={customerOptions}
                  placeholder="Select Or search"
                  setSearch={setSearch}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsAddCustomerOpen(true)}
                className="mb-[2px] flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#670063] text-white hover:bg-[#85007f] transition-colors"
                aria-label="Add Customer"
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
            </div>

            <FormInput
              name="location"
              label="Location"
              placeholder="Enter delivery address"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput name="deliveryDate" label="Delivery Date" type="date" />
              <FormInput name="deliveryTime" label="Delivery Time" type="time" />
            </div>

            <div className="mt-auto flex justify-end">
              <Button
                type="button"
                variant="add"
                size="none"
                onClick={handleSubmit}
                className="w-full sm:w-auto"
              >
                SAVE
              </Button>
            </div>
          </div>
        </div>
      </FormProvider>
      
      {isAddCustomerOpen && (
        <div className="absolute inset-0 z-[70]">
           <AddCustomerModal 
             isOpen={isAddCustomerOpen} 
             onClose={() => setIsAddCustomerOpen(false)} 
           />
        </div>
      )}
    </div>
  );
}