"use client";

import { useMemo, useState } from "react";
import userPlus from "../../../../public/images/icons/usergroup.png";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";
import { Button } from "@/src/components/ui/button";
import AddUserModal, { NewUserInput } from "@/src/components/user/AddUserModal";

type User = {
  id: number;
  userName: string;
  accessName: string;
  phone: string;
  countryCode: string;
  permission: string;
  createdDate: string;
  updatedDate: string;
};

const TABLE_COLUMNS = ["No.", "Name", "Created Date", "Updated Date", "Actions"] as const;
const TABLE_GRID = "grid-cols-[48px_1.6fr_1fr_1fr_70px]";

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) =>
      [user.userName, user.accessName].join(" ").toLowerCase().includes(query),
    );
  }, [users, search]);

  const handleAddUser = (data: NewUserInput) => {
    const today = formatDate(new Date());
    setUsers((current) => [
      ...current,
      {
        id: current.length + 1,
        userName: data.userName,
        accessName: data.accessName,
        phone: data.phone,
        countryCode: data.countryCode,
        permission: data.permission,
        createdDate: today,
        updatedDate: today,
      },
    ]);
    setIsAddOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const CARD_TOP = 0;
  const CARD_LEFT = 20;
  const CARD_WIDTH = 984;
  const CARD_HEIGHT = 661;

  return (
    <main className="flex h-full flex-col overflow-y-auto bg-black text-black">
      <POSHeader />

      <div
        className="relative flex-1 bg-[#EFEFEF]"
        style={{ minHeight: CARD_TOP + CARD_HEIGHT + 40 }}
      >
        <div
          className="absolute"
          style={{
            top: CARD_TOP,
            left: CARD_LEFT,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            borderRadius: 15,
            background: "#D2D2D2",
          }}
        />

        <div
          className="absolute flex items-center justify-between"
          style={{ top: CARD_TOP + 20, left: 30, width: 964 }}
        >
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: 26,
              lineHeight: "100%",
              color: "#000000",
            }}
          >
            Users
          </span>

          <Button
            variant="addcustomer"
            size="none"
            iconSrc={userPlus}
            iconAlt="Add users"
            onClick={() => setIsAddOpen(true)}
          >
            Add Users
          </Button>
        </div>

        <div
          className="absolute flex"
          style={{ top: CARD_TOP + 88, left: 30, width: 964 }}
        >
          <SearchInput
            variant="panel"
            value={search}
            onChange={(value) => setSearch(value)}
            className="ml-auto"
          />
        </div>

        <div
          className="absolute hidden items-center sm:flex"
          style={{
            top: CARD_TOP + 139,
            left: 30,
            width: 964,
            height: 40,
            justifyContent: "space-between",
            borderRadius: 10,
            background: "#EFEFEF",
            paddingRight: 11,
            paddingLeft: 11,
          }}
        >
          {TABLE_COLUMNS.map((column) => (
            <span
              key={column}
              className="truncate text-center"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 12,
                lineHeight: "normal",
                color: "#000000",
              }}
            >
              {column}
            </span>
          ))}
        </div>

        <div
          className="absolute flex flex-col overflow-y-auto"
          style={{
            top: CARD_TOP + 184,
            left: 30,
            width: 964,
            height: 255,
            borderRadius: 10,
            background: "#B8B8B8",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          {filteredUsers.length === 0 ? (
            <p
              className="px-[16px]"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 14,
                color: "#5D5D5D",
              }}
            >
              No data Data Available
            </p>
          ) : (
            filteredUsers.slice(0, pageSize).map((user, index) => (
              <div
                key={user.id}
                className={`grid border-b border-black/5 px-[16px] py-[10px] text-[12px] text-black ${TABLE_GRID}`}
              >
                <span>{index + 1}</span>
                <span className="truncate">{user.userName}</span>
                <span>{user.createdDate}</span>
                <span>{user.updatedDate}</span>
                <span />
              </div>
            ))
          )}
        </div>

        <div
          className="absolute"
          style={{ top: CARD_TOP + 184 + 255 + 14, left: 30, width: 964 }}
        >
          <Pagination
            currentPage={currentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={pageSize}
            onPageChange={handlePageChange}
          />
        </div>

        <div
          className="absolute flex items-center justify-center"
          style={{ top: CARD_TOP + CARD_HEIGHT + 14, left: CARD_LEFT, width: CARD_WIDTH }}
        >
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: 12,
              color: "#939393",
            }}
          >
            © 2026 Techon Innovations. All rights reserved.
          </span>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddUser}
      />
    </main>
  );
}