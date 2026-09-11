"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import userPlus from "../../../../public/images/icons/usergroup.png";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";
import { Button } from "@/src/components/ui/button";
import AddUserModal, { NewUserInput } from "@/src/components/user/AddUserModal";
import {
  UserRecord,
  UserPayload,
  UserUpdatePayload,
  createUser,
  updateUser,
  deleteUser,
  listUsers,
} from "@/src/api/user";

type User = {
  id: string;
  userName: string;
  email: string;
  role: string;
  createdDate: string;
  updatedDate: string;
};

const TABLE_COLUMNS = [
  "No.",
  "Name",
  "Created Date",
  "Updated Date",
  "Actions",
] as const;
const TABLE_GRID = "grid-cols-[48px_1.6fr_1fr_1fr_70px]";

function formatApiDate(date: string) {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-GB");
}

function mapUser(user: UserRecord): User {
  return {
    id: user._id,
    userName: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username,
    email: user.email,
    role: user.role,
    createdDate: formatApiDate(user.createdAt),
    updatedDate: formatApiDate(user.updatedAt),
  };
}

export default function UsersPage({
  // TODO: replace with your actual session/auth hook, e.g.
  // const { companyId } = useAuth();
  companyId,
}: {
  companyId: string;
}) {
  const [search, setSearch] = useState("");
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);

  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
  });

  const userRows = usersQuery.data?.data.map(mapUser) || [];

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return userRows;
    return userRows.filter((user) =>
      [user.userName, user.email, user.role].join(" ").toLowerCase().includes(query),
    );
  }, [userRows, search]);

  const handleSaveUser = async (data: NewUserInput) => {
    try {
      if (editingUser) {
        const payload: UserUpdatePayload = {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: `${data.countryCode}${data.phone}`,
          companyId,
          role: data.role,
          isActive: data.isActive,
          ...(data.password ? { password: data.password } : {}),
        };
        await updateUser(editingUser._id, payload);
        toast.success("User updated successfully");
      } else {
        const payload: UserPayload = {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: `${data.countryCode}${data.phone}`,
          companyId,
          password: data.password,
          role: data.role,
          isActive: data.isActive,
        };
        await createUser(payload);
        toast.success("User created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);
      setIsAddOpen(false);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Unable to save user");
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Delete ${user.userName}?`)) return;

    try {
      await deleteUser(user.id);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`${user.userName} deleted successfully`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Unable to delete user");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const CARD_TOP = 0;
  const CARD_LEFT = 20;
  const CARD_HEIGHT = 661;

  return (
    <main className="flex h-full flex-col overflow-x-hidden overflow-y-auto bg-black text-black">
      <POSHeader />

      <div
        className="relative flex-1 bg-[#E9E9E9]"
        style={{ minHeight: CARD_TOP + CARD_HEIGHT + 40 }}
      >
        <div
          className="absolute"
          style={{
            top: CARD_TOP,
            left: CARD_LEFT,
            right: CARD_LEFT,
            height: CARD_HEIGHT,
            borderRadius: 15,
            background: "#D2D2D2",
          }}
        />

        <div
          className="absolute flex items-center justify-between"
          style={{ top: CARD_TOP + 20, left: 30, right: 30 }}
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
            onClick={() => {
              setEditingUser(null);
              setIsAddOpen(true);
            }}
          >
            Add Users
          </Button>
        </div>

        <div
          className="absolute flex"
          style={{ top: CARD_TOP + 88, left: 30, right: 30 }}
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
            right: 30,
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
          className="absolute flex flex-col overflow-x-hidden overflow-y-auto"
          style={{
            top: CARD_TOP + 184,
            left: 30,
            right: 30,
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
                className={`grid items-center border-b border-black/5 px-[16px] py-[10px] text-[12px] text-black ${TABLE_GRID}`}
              >
                <span>{index + 1}</span>
                <span className="truncate">{user.userName}</span>
                <span>{user.createdDate}</span>
                <span>{user.updatedDate}</span>
                <span className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="editicon"
                    size="icon"
                    aria-label={`Edit ${user.userName}`}
                    onClick={() => {
                      const record = usersQuery.data?.data.find((u) => u._id === user.id);
                      if (record) {
                        setEditingUser(record);
                        setIsAddOpen(true);
                      }
                    }}
                  >
                    <Pencil size={15} />
                  </Button>
                  <Button
                    type="button"
                    variant="deleteicon"
                    size="icon"
                    aria-label={`Delete ${user.userName}`}
                    onClick={() => handleDeleteUser(user)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </span>
              </div>
            ))
          )}
        </div>

        <div
          className="absolute"
          style={{ top: CARD_TOP + 184 + 255 + 14, left: 30, right: 30 }}
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
          style={{
            top: CARD_TOP + CARD_HEIGHT + 14,
            left: CARD_LEFT,
            right: CARD_LEFT,
          }}
        >
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: 12,
              color: "#939393",
            }}
          >
            © 2026 FFERM Digital Labs. All rights reserved.
          </span>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditingUser(null);
        }}
        onAdd={handleSaveUser}
        mode={editingUser ? "edit" : "add"}
        initialUser={
          editingUser
            ? {
                username: editingUser.username,
                firstName: editingUser.firstName,
                lastName: editingUser.lastName,
                email: editingUser.email,
                phone: editingUser.phone,
                countryCode: "+91",
                role: editingUser.role,
                isActive: editingUser.isActive,
              }
            : null
        }
      />
    </main>
  );
}