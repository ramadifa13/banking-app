"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showAlert } from "@/components/alert";
import Table from "@/components/table";
import api from "@/lib/api";

const TransactionPage = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data: transactionData } = await api.get("/transactions", {
        params: {
          page: pageIndex + 1,
          limit: pageSize,
        },
      });

      setTransactions(transactionData.transactions);
      setPageCount(Math.ceil(transactionData.total / pageSize));
      setLoading(false);
    } catch (error) {
      setLoading(false);

      showAlert({
        icon: "error",
        title: "Error fetching transactions",
        text:
          error.response?.data?.error ||
          "There was an error fetching transaction data.",
      });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [pageIndex, pageSize]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Transaction ID",
        accessor: "id",
      },
      {
        Header: "From Account",
        accessor: (row) => row.fromAccountName,
      },
      {
        Header: "To Account",
        accessor: (row) => row.toAccountName || " - ",
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ row }) => (
          <span className="text-right">
            Rp.{row.original.amount.toLocaleString("id-ID")}
          </span>
        ),
      },
      {
        Header: "Transaction Type",
        accessor: "transactionType",
      },
      {
        Header: "Transaction Date",
        accessor: "transactionDate",
        Cell: ({ row }) => (
          <span>
            {new Date(row.original.transactionDate).toLocaleString("id-ID")}
          </span>
        ),
      },
      {
        Header: "Status",
        accessor: "transactionStatus",
      },
    ],
    []
  );

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Transactions</h2>
        <button
          onClick={() => router.push("/transaction/action")}
          className="bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Add Transaction
        </button>
      </div>

      <Table
        columns={columns}
        data={transactions}
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

export default TransactionPage;
