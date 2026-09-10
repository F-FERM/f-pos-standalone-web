"use client";

import { useMemo, useRef, useState } from "react";
import {
  Building2,
  Clock,
  Globe,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  Calendar,
  RefreshCw,
} from "lucide-react";
import userPlus from "../../../../../public/images/icons/usergroup.png";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";
import { Button } from "@/src/components/ui/button";
import AddCustomerTypeModal, { NewCustomerTypeInput } from "@/src/components/settings/restaurant/AddCustomerTypeModal";
import AddFloorModal, { NewFloorInput } from "@/src/components/settings/restaurant/AddFloorModal";
import AddTableModal, { NewTableInput } from "@/src/components/settings/restaurant/AddTableModal";

type CustomerType = {
  id: number;
  type: string;
};

type Floor = {
  id: number;
  floorName: string;
  numberOfTables: number;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
};

type TableRow = {
  id: number;
  floorName: string;
  tableName: string;
  seats: number;
  createdDate: string;
  updatedDate: string;
};

type RestaurantProfile = {
  image?: string;
  address: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  openingTime: string;
  closingTime: string;
  primaryPhone: string;
  secondaryPhone: string;
  createdDate: string;
  updatedDate: string;
};

const TABS = ["My Restaurant", "Customer Types", "Floor", "Table"] as const;
type RestaurantTab = (typeof TABS)[number];

const CUSTOMER_TYPE_COLUMNS = ["Type", "Action"] as const;
const CUSTOMER_TYPE_GRID = "grid-cols-[1fr_80px]";

const FLOOR_COLUMNS = [
  "No.",
  "Floor Name",
  "Number Of Tables",
  "Created By",
  "Created Date",
  "Updated Date",
  "Actions",
] as const;
const FLOOR_GRID = "grid-cols-[48px_1.2fr_1.2fr_1fr_1fr_1fr_80px]";

const TABLE_COLUMNS = [
  "No.",
  "Floor Name",
  "Table Name",
  "Seats",
  "Created Date",
  "Updated Date",
  "Actions",
] as const;
const TABLE_GRID = "grid-cols-[48px_1.2fr_1.2fr_0.8fr_1fr_1fr_80px]";

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const defaultProfile: RestaurantProfile = {
  address: "123 Main Street",
  phone: "+1234567890",
  email: "",
  country: "United States",
  state: "California",
  city: "Los Angeles",
  openingTime: "-",
  closingTime: "-",
  primaryPhone: "-",
  secondaryPhone: "-",
  createdDate: "31 Jul 2026, 3:34 PM",
  updatedDate: "31 Jul 2026, 3:34 PM",
};

export default function RestaurantSettingsPage() {
  const [activeTab, setActiveTab] = useState<RestaurantTab>("My Restaurant");
  const [search, setSearch] = useState("");
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [profile, setProfile] = useState<RestaurantProfile>(defaultProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [tables, setTables] = useState<TableRow[]>([]);

  const [isCustomerTypeModalOpen, setIsCustomerTypeModalOpen] = useState(false);
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const filteredCustomerTypes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customerTypes;
    return customerTypes.filter((c) => c.type.toLowerCase().includes(query));
  }, [customerTypes, search]);

  const filteredFloors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return floors;
    return floors.filter((f) => f.floorName.toLowerCase().includes(query));
  }, [floors, search]);

  const filteredTables = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return tables;
    return tables.filter((t) =>
      [t.floorName, t.tableName].join(" ").toLowerCase().includes(query),
    );
  }, [tables, search]);

  const handleImagePick = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setProfile((current) => ({ ...current, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleAddCustomerType = (data: NewCustomerTypeInput) => {
    setCustomerTypes((current) => [
      ...current,
      ...data.types.map((type, index) => ({ id: current.length + index + 1, type })),
    ]);
    setIsCustomerTypeModalOpen(false);
  };

  const handleAddFloor = (data: NewFloorInput) => {
    const today = formatDate(new Date());
    setFloors((current) => [
      ...current,
      ...data.floorNames.map((floorName, index) => ({
        id: current.length + index + 1,
        floorName,
        numberOfTables: 0,
        createdBy: "Admin",
        createdDate: today,
        updatedDate: today,
      })),
    ]);
    setIsFloorModalOpen(false);
  };

  const handleAddTable = (data: NewTableInput) => {
    const today = formatDate(new Date());
    setTables((current) => [
      ...current,
      {
        id: current.length + 1,
        floorName: data.floor,
        tableName: data.tableName,
        seats: data.capacity,
        createdDate: today,
        updatedDate: today,
      },
    ]);
    setFloors((current) =>
      current.map((f) =>
        f.floorName === data.floor
          ? { ...f, numberOfTables: f.numberOfTables + 1 }
          : f,
      ),
    );
    setIsTableModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openAddModal = () => {
    if (activeTab === "Customer Types") setIsCustomerTypeModalOpen(true);
    if (activeTab === "Floor") setIsFloorModalOpen(true);
    if (activeTab === "Table") setIsTableModalOpen(true);
  };

  const addLabel =
    activeTab === "Customer Types"
      ? "Add Customer"
      : activeTab === "Floor"
      ? "Add Floor"
      : "Add Table";

  const infoCards = [
    { icon: MapPin, label: "Address", value: profile.address },
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: Mail, label: "Email", value: profile.email || "Not specified" },
    { icon: Globe, label: "Country", value: profile.country },
    { icon: Globe, label: "State", value: profile.state },
    { icon: Building2, label: "City", value: profile.city },
    { icon: Clock, label: "Opening Time", value: profile.openingTime },
    { icon: Clock, label: "Closing Time", value: profile.closingTime },
    { icon: Phone, label: "Primary Phone", value: profile.primaryPhone },
    { icon: Smartphone, label: "Secondary Phone", value: profile.secondaryPhone },
  ];

  return (
    <main className="flex h-full flex-col  bg-black text-black">
      <POSHeader />

      <div className="flex flex-1 flex-col items-center gap-4 bg-[#EFEFEF] px-3  ">
        <div className="flex w-full max-w-[984px] flex-col gap-3 rounded-[15px] bg-[#D2D2D2] p-4  lg:min-h-[661px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              {TABS.map((tab) => {
                const selected = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setSearch("");
                    }}
                    className={`flex h-[42px] shrink-0 items-center justify-center whitespace-nowrap rounded-[12px] border px-5 font-poppins text-[18px] font-semibold transition-colors ${
                      selected
                        ? "border-transparent bg-[#450042] text-white"
                        : "border-[#9C9C9C] bg-[#D2D2D2] text-black"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {activeTab !== "My Restaurant" && (
              <Button
                variant="addcustomer"
                size="none"
                iconSrc={userPlus}
                iconAlt={addLabel}
                onClick={openAddModal}
              >
                {addLabel}
              </Button>
            )}
          </div>

          {activeTab === "My Restaurant" ? (
            <div className="flex flex-col gap-6 lg:h-[396px] lg:flex-row lg:justify-between mt-12">
              {/* Profile section */}
              <div className="flex w-full flex-col lg:w-[267px] lg:shrink-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImagePick(e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-3 flex h-[153px] w-[158px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#9C9C9C] bg-[#EFEFEF] p-[10px] text-[#A1A1A1]"
                >
                  {profile.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.image}
                      alt="Restaurant"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <ImagePlus size={22} />
                  )}
                </button>

                <div className="mb-2 flex items-center gap-2 font-poppins text-[18px] font-semibold leading-none text-black">
                  <Building2 size={18} />
                  Customer Types
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 font-poppins text-[16px] font-medium text-[#4D4D4D]">
                    <Calendar size={16} />
                    Created: {profile.createdDate}
                  </div>
                  <div className="flex items-center gap-2 font-poppins text-[16px] font-medium text-[#4D4D4D]">
                    <RefreshCw size={16} />
                    Updated: {profile.updatedDate}
                  </div>
                </div>
              </div>

              {/* Info cards grid — exact spec: 220x93, gap 10, pad 27/20/26/20 */}
              <div className="grid flex-1 grid-cols-1 gap-[10px] content-start sm:grid-cols-2 lg:grid-cols-3">
                {infoCards.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex h-[93px] w-full flex-col gap-[10px] rounded-[10px] bg-[#B8B8B8] pb-[26px] pl-[20px] pr-[20px] pt-[27px] sm:max-w-[220px]"
                  >
                    <div className="flex items-center gap-2 font-poppins text-[16px] font-semibold leading-none text-black">
                      <Icon size={16} />
                      {label}
                    </div>
                    <p
                      className={`font-poppins text-[16px] font-medium leading-none text-[#4D4D4D] ${
                        !value || value === "Not specified" ? "italic" : ""
                      }`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-4 lg:min-h-0">
              <div className="flex justify-end">
                <SearchInput variant="panel" value={search} onChange={(value) => setSearch(value)} />
              </div>

              {activeTab === "Customer Types" && (
                <>
                  <div
                    className={`hidden items-center rounded-[10px] bg-[#EFEFEF] px-3 py-2 font-poppins text-[12px] font-normal text-black sm:grid ${CUSTOMER_TYPE_GRID}`}
                  >
                    {CUSTOMER_TYPE_COLUMNS.map((column) => (
                      <span key={column} className="truncate">
                        {column}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-1 min-h-[180px] flex-col overflow-y-auto rounded-[10px] bg-[#B8B8B8] py-4 lg:min-h-0">
                    {filteredCustomerTypes.length === 0 ? (
                      <p className="px-4 font-poppins text-[14px] font-normal text-[#5D5D5D]">
                        No data Data Available
                      </p>
                    ) : (
                      filteredCustomerTypes.slice(0, pageSize).map((item) => (
                        <div
                          key={item.id}
                          className={`grid gap-2 border-b border-black/5 px-4 py-2.5 font-poppins text-[12px] text-black ${CUSTOMER_TYPE_GRID}`}
                        >
                          <span className="truncate">{item.type}</span>
                          <span />
                        </div>
                      ))
                    )}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalItems={filteredCustomerTypes.length}
                    itemsPerPage={pageSize}
                    onPageChange={handlePageChange}
                  />
                </>
              )}

              {activeTab === "Floor" && (
                <>
                  <div
                    className={`hidden items-center rounded-[10px] bg-[#EFEFEF] px-3 py-2 font-poppins text-[12px] font-normal text-black sm:grid ${FLOOR_GRID}`}
                  >
                    {FLOOR_COLUMNS.map((column) => (
                      <span key={column} className="truncate">
                        {column}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-1 min-h-[180px] flex-col overflow-y-auto rounded-[10px] bg-[#B8B8B8] py-4 lg:min-h-0">
                    {filteredFloors.length === 0 ? (
                      <p className="px-4 font-poppins text-[14px] font-normal text-[#5D5D5D]">
                        No data Data Available
                      </p>
                    ) : (
                      filteredFloors.slice(0, pageSize).map((floor, index) => (
                        <div
                          key={floor.id}
                          className={`grid gap-2 border-b border-black/5 px-4 py-2.5 font-poppins text-[12px] text-black ${FLOOR_GRID}`}
                        >
                          <span>{index + 1}</span>
                          <span className="truncate">{floor.floorName}</span>
                          <span>{floor.numberOfTables}</span>
                          <span className="truncate">{floor.createdBy}</span>
                          <span>{floor.createdDate}</span>
                          <span>{floor.updatedDate}</span>
                          <span />
                        </div>
                      ))
                    )}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalItems={filteredFloors.length}
                    itemsPerPage={pageSize}
                    onPageChange={handlePageChange}
                  />
                </>
              )}

              {activeTab === "Table" && (
                <>
                  <div
                    className={`hidden items-center rounded-[10px] bg-[#EFEFEF] px-3 py-2 font-poppins text-[12px] font-normal text-black sm:grid ${TABLE_GRID}`}
                  >
                    {TABLE_COLUMNS.map((column) => (
                      <span key={column} className="truncate">
                        {column}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-1 min-h-[180px] flex-col overflow-y-auto rounded-[10px] bg-[#B8B8B8] py-4 lg:min-h-0">
                    {filteredTables.length === 0 ? (
                      <p className="px-4 font-poppins text-[14px] font-normal text-[#5D5D5D]">
                        No data Data Available
                      </p>
                    ) : (
                      filteredTables.slice(0, pageSize).map((table, index) => (
                        <div
                          key={table.id}
                          className={`grid gap-2 border-b border-black/5 px-4 py-2.5 font-poppins text-[12px] text-black ${TABLE_GRID}`}
                        >
                          <span>{index + 1}</span>
                          <span className="truncate">{table.floorName}</span>
                          <span className="truncate">{table.tableName}</span>
                          <span>{table.seats}</span>
                          <span>{table.createdDate}</span>
                          <span>{table.updatedDate}</span>
                          <span />
                        </div>
                      ))
                    )}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalItems={filteredTables.length}
                    itemsPerPage={pageSize}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          )}
        </div>

        <span className="font-poppins text-[12px] font-medium text-[#939393]">
          © 2026 Techon Innovations. All rights reserved.
        </span>
      </div>

      <AddCustomerTypeModal
        isOpen={isCustomerTypeModalOpen}
        onClose={() => setIsCustomerTypeModalOpen(false)}
        onAdd={handleAddCustomerType}
        existingTypeOptions={customerTypes.map((c) => ({ label: c.type, value: c.type }))}
      />

      <AddFloorModal
        isOpen={isFloorModalOpen}
        onClose={() => setIsFloorModalOpen(false)}
        onAdd={handleAddFloor}
      />

      <AddTableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onAdd={handleAddTable}
        floorOptions={floors.map((f) => ({ label: f.floorName, value: f.floorName }))}
      />
    </main>
  );
}