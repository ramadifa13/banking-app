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
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);



  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data: accountData } = await api.get("/accounts", {
        params: {
          page: pageIndex + 1,
          limit: pageSize,
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
  }, [pageIndex, pageSize]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Account ID",
        accessor: "id",
      },
      {
        Header: "Customer Name",
        accessor: (row) => row.customer.name,
      },
      {
        Header: "Account Number",
        accessor: "accountNumber",
      },
      {
        Header: "Account Type",
        accessor: "accountType",
      },
      {
        Header: "Balance",
        accessor: "balance",
        Cell: ({ row }) => (
          <span className="text-right">Rp.{row.original.balance.toLocaleString("id-ID")}</span>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button
            onClick={() => router.push(`/account/${row.original.id}`)}
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
