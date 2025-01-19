'use client';

import { useEffect, useState } from "react";
import api from "@/lib/api"; 
import { showAlert } from "@/components/alert"; 
import Card from "@/components/card";
import { getAuthToken } from "@/lib/common/token";

const Page = () => {
  const [role, setRole] = useState(null);
  const [totalCustomer, setTotalCustomer] = useState(null); 
  const [totalAccount, setTotalAccount] = useState(null); 
  const [totalTransaction, setTotalTransaction] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = await getAuthToken();
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (!decodedToken) {
          setLoading(false);
          return;
        }

        setRole(decodedToken.role);

        if (decodedToken.role === 'admin') {
          const { data: customersData } = await api.get('/customer/total');
          setTotalCustomer(customersData.total);
          const { data: accountsData } = await api.get('/accounts/total');
          setTotalAccount(accountsData.total);
        } else if (decodedToken.role === 'customer') {
          const { data: accountData } = await api.get('/accounts/total-self');
          setTotalAccount(accountData.total);

          const { data: transactionData } = await api.get('/transactions/total-self');
          setTotalTransaction(transactionData.total);
        }
      } catch (error) {
        showAlert({
          icon: 'error',
          title: 'Failed to fetch data',
          text: error.response?.data?.error || 'There was an error while fetching the data.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-transparent border-blue-600" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {role === 'admin' && (
          <>
            <Card title="Total Customers" value={totalCustomer ?? 0} />
            <Card title="Total Accounts" value={totalAccount ?? 0} />
          </>
        )}

        {role === 'customer' && (
          <>
            <Card title="Total Accounts" value={totalAccount ?? 0} />
            <Card title="Total Transactions" value={totalTransaction ?? 0} />
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
