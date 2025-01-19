"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showAlert } from "@/components/alert";
import Table from "@/components/table";
import api from "@/lib/api";

const AccountPage = () => {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [filters, setFilters] = useState({ name: "" });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [debouncedName, setDebouncedName] = useState(filters.name);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prevFilters) => ({ ...prevFilters, name: debouncedName }));
    }, 500);
    return () => clearTimeout(timer);
  }, [debouncedName]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data: accountData } = await api.get("/accounts", {
        params: {
          page: pageIndex + 1,
          limit: pageSize,
          name: filters.name,
        },
      });

      setAccounts(accountData.accounts);
      setPageCount(Math.ceil(accountData.total / pageSize));
      setLoading(false);
    } catch (error) {
      setLoading(false);

      showAlert({
        icon: "error",
        title: "Error fetching accounts",
        text:
          error.response?.data?.error ||
          "There was an error fetching account data.",
      });
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [filters, pageIndex, pageSize]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Account ID",
        accessor: "id",
      },
      {
        Header: "Customer Name",
        accessor: "customerName",
      },
      {
        Header: "Account Number",
        accessor: "accountNumber",
      },
      {
        Header: "Balance",
        accessor: "balance",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button
            onClick={() => router.push(`/accounts/edit/${row.original.id}`)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Accounts</h2>
        <button
          onClick={() => router.push("/account/null")}
          className="bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Add Account
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name"
        value={debouncedName}
        onChange={(e) => setDebouncedName(e.target.value)}
        className="mb-4 p-2 border rounded-md"
      />

      <Table
        columns={columns}
        data={accounts}
        loading={loading}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        pageCount={pageCount}
      />
    </div>
  );
};

export default AccountPage;
