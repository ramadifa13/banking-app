"use client";

import React, { useEffect, useState } from "react";
import { deleteToken, getAuthToken } from "@/lib/common/token";
import { showAlert } from "@/components/alert";

const layout = ({ children }) => {
  const [role, setRole] = useState(null);
  const handleLogout = async () => {
    await deleteToken();
    showAlert({
      icon: "success",
      title: "Logged Out",
      text: "You have been successfully logged out.",
    });
  };
  useEffect(() => {
    const fetchRole = async () => {
      const token = await getAuthToken();
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken) {
        try {
          setRole(decodedToken.role);
        } catch (error) {
          showAlert({
            icon: "error",
            title: "Failed to decode token",
            text: "There was an error while decoding the token. Please try again.",
          });
        }
      }
    };

    fetchRole();
  }, []);

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div
          className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-transparent border-blue-600"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white p-6 rounded-r-3xl">
        <h2 className="text-2xl font-bold mb-6">Banking App</h2>
        <ul>
          <li className="mb-4">
            <a href="/dashboard" className="text-gray-300 hover:text-white">
              Dashboard
            </a>
          </li>

          {role === "admin" && (
            <li className="mb-4">
              <a href="/customer" className="text-gray-300 hover:text-white">
                Customer
              </a>
            </li>
          )}

          {role === "customer" && (
            <li className="mb-4">
              <a href="/account" className="text-gray-300 hover:text-white">
                Account
              </a>
            </li>
          )}

          <li className="mb-4">
            <a href="/transaction" className="text-gray-300 hover:text-white">
              Transaction
            </a>
          </li>
          <li className="mb-4">
            <a href="/report" className="text-gray-300 hover:text-white">
              Report
            </a>
          </li>
          <li className="mb-4">
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-8">{children}</div>
    </div>
  );
};

export default layout;
