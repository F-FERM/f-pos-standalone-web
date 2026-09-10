"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  Pencil,
  Trash2,
} from "lucide-react";
import userPlus from "../../../../../public/images/icons/usergroup.png";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";
import { Button } from "@/src/components/ui/button";
import AddCustomerTypeModal, {
  NewCustomerTypeInput,
} from "@/src/components/settings/restaurant/AddCustomerTypeModal";
import AddFloorModal, {
  NewFloorInput,
} from "@/src/components/settings/restaurant/AddFloorModal";
import AddTableModal, {
  NewTableInput,
} from "@/src/components/settings/restaurant/AddTableModal";
import { listRestaurants, type RestaurantRecord } from "@/src/api/restaurant";
import {
  CUSTOMER_TYPE_OPTIONS,
  createCustomerType,
  deleteCustomerType,
  listCustomerTypes,
  updateCustomerType,
  type CustomerTypeRecord,
  type CustomerTypeValue,
} from "@/src/api/customer-type";
import { toast } from "sonner";
import {
  createFloor,
  deleteFloor,
  listFloors,
  updateFloor,
  type FloorRecord,
} from "@/src/api/floor";
import {
  createTable,
  deleteTable,
  listTables,
  updateTable,
  type TableRecord,
} from "@/src/api/table";

type CustomerType = {
  id: string;
  type: CustomerTypeValue;
  createdDate: string;
  updatedDate: string;
};

type Floor = {
  id: string;
  floorName: string;
  numberOfTables: number;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
};

type TableRow = {
  id: string;
  floorId: string;
  floorName: string;
  tableName: string;
  seats: number;
  createdDate: string;
  updatedDate: string;
};

type RestaurantProfile = {
  name: string;
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

const defaultProfile: RestaurantProfile = {
  name: "Restaurant",
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

function formatProfileDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
}

function mapRestaurantProfile(restaurant: RestaurantRecord): RestaurantProfile {
  return {
    name: restaurant.name,
    image: restaurant.logo || undefined,
    address: restaurant.address || "-",
    phone: restaurant.phone || "-",
    email: restaurant.email || "",
    country: restaurant.country || "-",
    state: restaurant.state || "-",
    city: restaurant.city || "-",
    openingTime: restaurant.openingTime || "-",
    closingTime: restaurant.closingTime || "-",
    primaryPhone: restaurant.phone || "-",
    secondaryPhone: restaurant.phone2 || "-",
    createdDate: formatProfileDate(restaurant.createdAt),
    updatedDate: formatProfileDate(restaurant.updatedAt),
  };
}

function mapCustomerType(customerType: CustomerTypeRecord): CustomerType {
  return {
    id: customerType._id,
    type: customerType.type,
    createdDate: formatProfileDate(customerType.createdAt),
    updatedDate: formatProfileDate(customerType.updatedAt),
  };
}

function mapFloor(floor: FloorRecord): Floor {
  return {
    id: floor._id,
    floorName: floor.name,
    numberOfTables: 0,
    createdBy: floor.createdBy || "Admin",
    createdDate: formatProfileDate(floor.createdAt),
    updatedDate: formatProfileDate(floor.updatedAt),
  };
}

function mapTable(table: TableRecord): TableRow {
  return {
    id: table._id,
    floorId: table.floorId._id,
    floorName: table.floorId.name,
    tableName: table.name,
    seats: table.capacity,
    createdDate: formatProfileDate(table.createdAt),
    updatedDate: formatProfileDate(table.updatedAt),
  };
}

export default function RestaurantSettingsPage() {
  const [activeTab, setActiveTab] = useState<RestaurantTab>("My Restaurant");
  const [search, setSearch] = useState("");
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [profile, setProfile] = useState<RestaurantProfile>(defaultProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    listRestaurants()
      .then((response) => {
        const restaurant =
          response.data.find((item) => item.isActive) || response.data[0];

        if (!cancelled && restaurant) {
          setProfile(mapRestaurantProfile(restaurant));
        }
      })
      .catch(() => {
        // Keep the local fallback profile visible if the restaurant request fails.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([]);
  const [editingCustomerType, setEditingCustomerType] =
    useState<CustomerType | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [tables, setTables] = useState<TableRow[]>([]);
  const [editingTable, setEditingTable] = useState<TableRow | null>(null);

  const [isCustomerTypeModalOpen, setIsCustomerTypeModalOpen] = useState(false);
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  useEffect(() => {
    listCustomerTypes()
      .then((response) =>
        setCustomerTypes((response.data || []).map(mapCustomerType)),
      )
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load customer types",
        );
      });
  }, []);

  useEffect(() => {
    listFloors()
      .then((response) => setFloors((response.data || []).map(mapFloor)))
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : "Unable to load floors",
        );
      });
  }, []);

  useEffect(() => {
    listTables()
      .then((response) => setTables((response.data || []).map(mapTable)))
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : "Unable to load tables",
        );
      });
  }, []);

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

  const handleSaveCustomerType = async (data: NewCustomerTypeInput) => {
    const selectedType = data.types[0] as CustomerTypeValue | undefined;
    if (!selectedType) return;

    try {
      if (editingCustomerType) {
        const response = await updateCustomerType(
          editingCustomerType.id,
          selectedType,
        );
        setCustomerTypes((current) =>
          current.map((customerType) =>
            customerType.id === editingCustomerType.id
              ? mapCustomerType(response.data)
              : customerType,
          ),
        );
        toast.success("Customer type updated successfully");
      } else {
        const response = await createCustomerType(selectedType);
        setCustomerTypes((current) => [
          mapCustomerType(response.data),
          ...current,
        ]);
        toast.success("Customer type created successfully");
      }

      setEditingCustomerType(null);
      setIsCustomerTypeModalOpen(false);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save customer type",
      );
    }
  };

  const handleDeleteCustomerType = async (customerType: CustomerType) => {
    if (!window.confirm(`Delete ${customerType.type}?`)) return;

    try {
      await deleteCustomerType(customerType.id);
      setCustomerTypes((current) =>
        current.filter((item) => item.id !== customerType.id),
      );
      toast.success(`${customerType.type} deleted successfully`);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete customer type",
      );
    }
  };

  const handleSaveFloor = async (data: NewFloorInput) => {
    const floorName = data.floorNames[0]?.trim();
    if (!floorName) return;

    try {
      if (editingFloor) {
        const response = await updateFloor(editingFloor.id, floorName);
        setFloors((current) =>
          current.map((floor) =>
            floor.id === editingFloor.id ? mapFloor(response.data) : floor,
          ),
        );
        toast.success("Floor updated successfully");
      } else {
        const response = await createFloor(floorName);
        setFloors((current) => [mapFloor(response.data), ...current]);
        toast.success("Floor created successfully");
      }

      setEditingFloor(null);
      setIsFloorModalOpen(false);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save floor",
      );
    }
  };

  const handleDeleteFloor = async (floor: Floor) => {
    if (!window.confirm(`Delete ${floor.floorName}?`)) return;

    try {
      await deleteFloor(floor.id);
      setFloors((current) => current.filter((item) => item.id !== floor.id));
      toast.success(`${floor.floorName} deleted successfully`);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete floor",
      );
    }
  };

  const handleSaveTable = async (data: NewTableInput) => {
    const payload = {
      floorId: data.floor,
      name: data.tableName,
      capacity: data.capacity,
    };

    try {
      if (editingTable) {
        const response = await updateTable(editingTable.id, payload);
        setTables((current) =>
          current.map((table) =>
            table.id === editingTable.id ? mapTable(response.data) : table,
          ),
        );
        toast.success("Table updated successfully");
      } else {
        const response = await createTable(payload);
        setTables((current) => [mapTable(response.data), ...current]);
        toast.success("Table created successfully");
      }

      setEditingTable(null);
      setIsTableModalOpen(false);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save table",
      );
    }
  };

  const handleDeleteTable = async (table: TableRow) => {
    if (!window.confirm(`Delete ${table.tableName}?`)) return;

    try {
      await deleteTable(table.id);
      setTables((current) => current.filter((item) => item.id !== table.id));
      toast.success(`${table.tableName} deleted successfully`);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete table",
      );
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openAddModal = () => {
    if (activeTab === "Customer Types") {
      setEditingCustomerType(null);
      setIsCustomerTypeModalOpen(true);
    } else if (activeTab === "Floor") {
      setEditingFloor(null);
      setIsFloorModalOpen(true);
    } else if (activeTab === "Table") {
      setEditingTable(null);
      setIsTableModalOpen(true);
    }
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
    {
      icon: Smartphone,
      label: "Secondary Phone",
      value: profile.secondaryPhone,
    },
  ];

  return (
    <main className="flex h-full flex-col overflow-x-hidden bg-black text-black">
      <POSHeader />

      <div className="flex flex-1 flex-col items-center gap-4 bg-[#EFEFEF] px-3  ">
        <div className="flex w-full flex-col gap-3 rounded-[15px] bg-[#D2D2D2] p-4 lg:min-h-[661px]">
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
                  {profile.name}
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
                <SearchInput
                  variant="panel"
                  value={search}
                  onChange={(value) => setSearch(value)}
                />
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
                          <span className="flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              variant="editicon"
                              size="icon"
                              aria-label={`Edit ${item.type}`}
                              onClick={() => {
                                setEditingCustomerType(item);
                                setIsCustomerTypeModalOpen(true);
                              }}
                            >
                              <Pencil size={15} />
                            </Button>
                            <Button
                              type="button"
                              variant="deleteicon"
                              size="icon"
                              aria-label={`Delete ${item.type}`}
                              onClick={() => handleDeleteCustomerType(item)}
                            >
                              <Trash2 size={15} />
                            </Button>
                          </span>
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
                          <span className="flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              variant="editicon"
                              size="icon"
                              aria-label={`Edit ${floor.floorName}`}
                              onClick={() => {
                                setEditingFloor(floor);
                                setIsFloorModalOpen(true);
                              }}
                            >
                              <Pencil size={15} />
                            </Button>
                            <Button
                              type="button"
                              variant="deleteicon"
                              size="icon"
                              aria-label={`Delete ${floor.floorName}`}
                              onClick={() => handleDeleteFloor(floor)}
                            >
                              <Trash2 size={15} />
                            </Button>
                          </span>
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
                          <span className="flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              variant="editicon"
                              size="icon"
                              aria-label={`Edit ${table.tableName}`}
                              onClick={() => {
                                setEditingTable(table);
                                setIsTableModalOpen(true);
                              }}
                            >
                              <Pencil size={15} />
                            </Button>
                            <Button
                              type="button"
                              variant="deleteicon"
                              size="icon"
                              aria-label={`Delete ${table.tableName}`}
                              onClick={() => handleDeleteTable(table)}
                            >
                              <Trash2 size={15} />
                            </Button>
                          </span>
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
        onClose={() => {
          setIsCustomerTypeModalOpen(false);
          setEditingCustomerType(null);
        }}
        onAdd={handleSaveCustomerType}
        mode={editingCustomerType ? "edit" : "add"}
        initialType={editingCustomerType?.type ?? null}
        existingTypeOptions={CUSTOMER_TYPE_OPTIONS.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
      />

      <AddFloorModal
        isOpen={isFloorModalOpen}
        onClose={() => {
          setIsFloorModalOpen(false);
          setEditingFloor(null);
        }}
        onAdd={handleSaveFloor}
        mode={editingFloor ? "edit" : "add"}
        initialFloor={editingFloor?.floorName ?? null}
        existingFloorOptions={floors.map((floor) => ({
          label: floor.floorName,
          value: floor.floorName,
        }))}
      />

      <AddTableModal
        isOpen={isTableModalOpen}
        onClose={() => {
          setIsTableModalOpen(false);
          setEditingTable(null);
        }}
        onAdd={handleSaveTable}
        mode={editingTable ? "edit" : "add"}
        initialTable={
          editingTable
            ? {
                floor: editingTable.floorId,
                tableName: editingTable.tableName,
                capacity: editingTable.seats,
              }
            : null
        }
        floorOptions={floors.map((floor) => ({
          label: floor.floorName,
          value: floor.id,
        }))}
      />
    </main>
  );
}
