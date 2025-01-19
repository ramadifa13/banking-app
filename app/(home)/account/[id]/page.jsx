'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { showAlert } from "@/components/alert";
import api from "@/lib/api";

const schema = yup
  .object({
    accountType: yup.string().required("Account type is required"),
    balance: yup
      .number()
      .required("Balance is required")
      .min(0, "Balance must be at least 0"),
  })
  .required();

const AccountFormPage = ({ params }) => {
  const router = useRouter();
  const { id } = React.use(params);
  const [loading, setLoading] = useState(false);
  const [formattedBalance, setFormattedBalance] = useState("0");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (id !== "null") {
      const fetchAccountData = async () => {
        try {
          setLoading(true);
          const { data: datas } = await api.get(`/accounts/${id}`);
          setValue("accountType", datas.accountType);
          setValue("balance", datas.balance);
          setFormattedBalance(datas.balance.toLocaleString("id-ID"));
          setLoading(false);
        } catch (error) {
          setLoading(false);
          showAlert({
            icon: "error",
            title: "Error fetching account",
            text: error.response?.data?.error || "There was an error fetching account data.",
          });
        }
      };
      fetchAccountData();
    }
  }, [id, setValue]);

  const handleBalanceChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    value = new Intl.NumberFormat("id-ID").format(value);
    setFormattedBalance(value);
    setValue("balance", value.replace(/\D/g, ""));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (id !== "null") {
        await api.put(`/accounts/${id}`, data);
        showAlert({ icon: "success", title: "Account updated successfully!" });
      } else {
        await api.post("/accounts", data);
        showAlert({ icon: "success", title: "Account created successfully!" });
      }
      router.back();
    } catch (error) {
      setLoading(false);
      showAlert({
        icon: "error",
        title: id !== "null" ? "Error updating account" : "Error creating account",
        text: error.response?.data?.error || "There was an error saving the account.",
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">
        {id !== "null" ? "Edit Account" : "Add Account"}
      </h2>
      {loading ? (
        <div className="flex justify-center">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Hidden Account Number Field */}
          <input
            id="accountNumber"
            type="hidden"
            {...register("accountNumber")}
          />

          {/* Hidden Customer ID Field */}
          <input
            id="customerId"
            type="hidden"
            {...register("customerId")}
          />

          <div>
            <label htmlFor="accountType" className="block text-sm font-medium">
              Account Type
            </label>
            <select
              id="accountType"
              {...register("accountType")}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="Tabungan">Tabungan</option>
              <option value="Deposito">Deposito</option>
            </select>
            {errors.accountType && (
              <p className="text-red-500 text-xs">
                {errors.accountType.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="balance" className="block text-sm font-medium">
              Balance (Rupiah)
            </label>
            <input
              id="balance"
              type="text"
              value={formattedBalance}
              onChange={handleBalanceChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
            {errors.balance && (
              <p className="text-red-500 text-xs">{errors.balance.message}</p>
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
              {id !== "null" ? "Update Account" : "Add Account"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AccountFormPage;
