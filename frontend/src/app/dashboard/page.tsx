"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get the current session user
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Success!</h1>
        <p className="text-gray-700 text-lg mb-6">
          You have successfully registered and logged in.
        </p>
        
        {user ? (
          <div className="bg-gray-100 p-4 rounded-md text-left">
            <p className="text-sm text-gray-500 font-semibold">User Data:</p>
            <p className="text-gray-800 break-all"><strong>Email:</strong> {user.email}</p>
            <p className="text-gray-800 mt-2 text-xs break-all"><strong>ID:</strong> {user.id}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">Loading user data...</p>
        )}

        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = '/register';
          }}
          className="mt-8 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
