"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showAlert } from "@/components/alert";
import Table from "@/components/table";
import api from "@/lib/api";

const ReportPage = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const today = new Date();
  const defaultStartDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
  const defaultEndDate = today.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]); 

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data: transactionData } = await api.get("/report", {
        params: {
          page: pageIndex + 1,
          limit: pageSize,
          startDate,
          endDate,
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
  }, [pageIndex, pageSize, startDate, endDate]);

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
        <h2 className="text-2xl font-semibold">Transaction Report</h2>
        <div className="flex space-x-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md p-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md p-2"
          />
        </div>
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

export default ReportPage;
