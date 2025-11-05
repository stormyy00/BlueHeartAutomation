"use client";

import React, { useMemo, useState } from "react";
import { COLUMNS } from "@/data/table/columns";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  RowSelectionState,
} from "@tanstack/react-table";
import Table from "./table";
import Toolbar from "./toolbar";
// import { Team } from "@/types";

import { useQuery } from "@tanstack/react-query";
import { Label } from "../ui/label";
import { getUsersbyOrgId } from "../manage/actions";
import { useParams } from "next/navigation";
// import { getUsers } from "@/server/queries/fetch";

const mockMembers = [
  {
    id: "1",
    name: "Arch Linux",
    email: "alinux@example.com",
    role: "Administrator",
    joinedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    joinedAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "User",
    joinedAt: new Date("2024-03-10"),
  },
  {
    id: "4",
    name: "Taaha Brown",
    email: "taaha.brown@example.com",
    role: "Administrator",
    joinedAt: new Date("2024-01-25"),
  },
  {
    id: "5",
    name: "Bob Brown",
    email: "bob.brown@example.com",
    role: "User",
    joinedAt: new Date("2024-04-05"),
  },
  {
    id: "6",
    name: "Jerry Li",
    email: "jerry.li@example.com",
    role: "Moderator",
    joinedAt: new Date("2024-03-15"),
  },
  {
    id: "7",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "User",
    joinedAt: new Date("2024-02-10"),
  },
  {
    id: "8",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Moderator",
    joinedAt: new Date("2024-04-12"),
  },
  {
    id: "9",
    name: "Howard Zhu",
    email: "hzhu.brown@example.com",
    role: "Administrator",
    joinedAt: new Date("2024-01-30"),
  },
  {
    id: "10",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "User",
    joinedAt: new Date("2024-03-25"),
  },
  {
    id: "11",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Moderator",
    joinedAt: new Date("2024-03-25"),
  },
  {
    id: "12",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Moderator",
    joinedAt: new Date("2024-03-25"),
  },
  {
    id: "13",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Moderator",
    joinedAt: new Date("2024-03-25"),
  },
  {
    id: "14",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Moderator",
    joinedAt: new Date("2024-03-25"),
  },
  {
    id: "15",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Moderator",
    joinedAt: new Date("2024-03-25"),
  },
];

const Members = () => {
  const [searchValue, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [checked, setChecked] = useState<RowSelectionState>({});
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { orgId } = useParams();
  const orgQuery = useQuery({
    queryKey: ["my-org"],
    queryFn: async () => {
      const resp = await fetch(`/api/orgs/${orgId}`);
      return {
        status: resp.status,
        data: (await resp.json())["message"],
      };
    },
  });

  const {
    data: members,
    isPending,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["user", orgId],
    queryFn: async () => getUsersbyOrgId(orgId ?? ""),
    enabled: !!orgQuery.data && orgQuery.data.status === 200,
  });

  // Use mock data for testing - comment out the line below to use real data
  const testMembers = mockMembers;

  console.log("Members data:", members);

  const searchableItems = useMemo(() => {
    // Use test data for testing - change this to members to use real data
    const dataSource = testMembers;
    if (!dataSource) return [];
    return dataSource.filter(({ name, email, role }) => {
      const matchesSearch =
        !searchValue.trim() ||
        name.toLowerCase().includes(searchValue.toLowerCase()) ||
        email.toLowerCase().includes(searchValue.toLowerCase());
      const matchesStatus = statusFilter === "all" || role === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [testMembers, searchValue, statusFilter]);

  const tableInstance = useReactTable({
    data: searchableItems,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableFilters: true,
    enableRowSelection: true,
    enablePagination: true,
    onRowSelectionChange: setChecked,
    onPaginationChange: setPagination,
    state: {
      rowSelection: checked,
      pagination,
    },
  });

  const { getFilteredSelectedRowModel } = tableInstance;

  return (
    <div className=" w-full">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Label className="font-semibold text-3xl">Members</Label>
        <Toolbar
          searchValue={searchValue}
          onSearchChange={(value) => setSearch(value)}
          setFilterStatus={setStatusFilter}
          getFilteredSelectedRowModel={getFilteredSelectedRowModel}
          refetch={refetch}
          checked={checked}
          isRefetching={isRefetching}
        />
        <Table
          table={tableInstance}
          loading={isPending}
          error={error}
          isRefetching={isRefetching}
        />
      </div>
    </div>
  );
};

export default Members;
