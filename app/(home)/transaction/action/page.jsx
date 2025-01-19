'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { showAlert } from "@/components/alert";
import api from "@/lib/api";

const schema = yup.object().shape({
  transactionType: yup.string().required("Transaction type is required"),
  amount: yup
    .number()
    .required("Amount is required")
    .min(1, "Amount must be at least 1"),
  fromAccountId: yup.number().required("From account is required"),
  toAccountId: yup.string().when('transactionType', {
    is: 'Transfer',
    then: () => yup.string().required("To account is required"),
    otherwise: () => yup.string().notRequired()
  })
});

const TransactionFormPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [formattedAmount, setFormattedAmount] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      transactionType: "Setoran",
      fromAccountId: "",
      toAccountId: "",
      amount: ""
    }
  });

  const transactionType = watch("transactionType");
  const fromAccountId = watch("fromAccountId");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const { data: accountData } = await api.get("/accounts");
        setAccounts(accountData.accounts);
        if (accountData.accounts.length > 0) {
          setValue("fromAccountId", accountData.accounts[0].id.toString());
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        showAlert({
          icon: "error",
          title: "Error fetching accounts",
          text: error.response?.data?.error || "There was an error fetching account data.",
        });
      }
    };
    fetchAccounts();
  }, [setValue]);

  useEffect(() => {
    if (transactionType !== 'Transfer') {
      setValue('toAccountId', '');
    } else if (accounts.length > 0) {
      const otherAccounts = accounts.filter(acc => acc.id !== parseInt(fromAccountId));
      if (otherAccounts.length > 0) {
        setValue('toAccountId', otherAccounts[0].id.toString());
      }
    }
  }, [transactionType, fromAccountId, accounts, setValue]);

  const handleAmountChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); 
    value = new Intl.NumberFormat("id-ID").format(value); 
    setFormattedAmount(value); 
    setValue("amount", value.replace(/\D/g, ""));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/transactions", data);
      showAlert({ icon: "success", title: "Transaction created successfully!" });
      router.back();
    } catch (error) {
      setLoading(false);
      showAlert({
        icon: "error",
        title: "Error creating transaction",
        text: error.response?.data?.error || "There was an error saving the transaction.",
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">Create Transaction</h2>

      {loading ? (
        <div className="flex justify-center">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="transactionType" className="block text-sm font-medium">
              Transaction Type
            </label>
            <select
              id="transactionType"
              {...register("transactionType")}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="Setoran">Setoran</option>
              <option value="Penarikan">Penarikan</option>
              <option value="Transfer">Transfer</option>
            </select>
            {errors.transactionType && (
              <p className="text-red-500 text-xs">
                {errors.transactionType.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="fromAccountId" className="block text-sm font-medium">
              From Account
            </label>
            <select
              id="fromAccountId"
              {...register("fromAccountId")}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="">Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber} - {account.accountType}
                </option>
              ))}
            </select>
            {errors.fromAccountId && (
              <p className="text-red-500 text-xs">{errors.fromAccountId.message}</p>
            )}
          </div>

          {transactionType === "Transfer" && (
            <div>
              <label htmlFor="toAccountId" className="block text-sm font-medium">
                To Account
              </label>
              <select
                id="toAccountId"
                {...register("toAccountId")}
                className="mt-1 p-2 w-full border rounded-md"
              >
                <option value="">Select account</option>
                {accounts
                  .filter((account) => account.id !== parseInt(fromAccountId))
                  .map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountNumber} - {account.accountType}
                    </option>
                  ))}
              </select>
              {errors.toAccountId && (
                <p className="text-red-500 text-xs">{errors.toAccountId.message}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount (Rupiah)
            </label>
            <input
              id="amount"
              type="text"
              value={formattedAmount}
              onChange={handleAmountChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs">{errors.amount.message}</p>
            )}
          </div>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-300 text-black py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md"
              disabled={loading}
            >
              Create Transaction
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TransactionFormPage;
