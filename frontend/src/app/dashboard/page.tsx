"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";

export default function Dashboard() {

  const [verified, setVerified] = useState(false);

  const [skipped, setSkipped] = useState(false);

  // VERIFY BUTTON
  const handleVerify = () => {

    setVerified(true);

    setSkipped(false);

  };

  // SKIP BUTTON
  const handleSkip = () => {

    setSkipped(true);

    setVerified(false);

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center">

        {/* Heading */}
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🎉 Success!
        </h1>

        <p className="text-gray-700 text-lg mb-8">
          You have successfully registered and logged in.
        </p>

        {/* VERIFY SECTION */}
        {!verified && !skipped && (

          <div className="space-y-4 mb-6">

            <p className="text-gray-600 font-medium">
              Would you like to verify your account now?
            </p>

            {/* VERIFY BUTTON */}
            <button
              onClick={handleVerify}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
            >
              Verify Now
            </button>

            {/* SKIP BUTTON */}
            <button
              onClick={handleSkip}
              className="w-full py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition"
            >
              Skip For Now
            </button>

          </div>

        )}

        {/* VERIFIED */}
        {verified && (

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">

            <h2 className="text-2xl font-bold text-green-600 mb-2">
              ✅ Account Verified
            </h2>

            <p className="text-gray-700">
              Your account has been verified successfully.
            </p>

          </div>

        )}

        {/* SKIPPED */}
        {skipped && (

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">

            <h2 className="text-2xl font-bold text-yellow-600 mb-2">
              ⏭ Verification Skipped
            </h2>

            <p className="text-gray-700">
              You can verify your account later.
            </p>

          </div>

        )}

        {/* SIGN OUT */}
        <button
          onClick={async () => {

            await supabase.auth.signOut();

            window.location.href = "/register";

          }}
          className="mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
        >
          Sign Out
        </button>

      </div>

    </div>

  );

}