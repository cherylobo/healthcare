"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";

export default function LoginPage() {

  const [method, setMethod] =
    useState<"email" | "otp">("email");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [otpToken, setOtpToken] =
    useState("");

  const [step, setStep] =
    useState<"input" | "verify">("input");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL
    || "http://localhost:5000";

  // ==========================================
  // EMAIL LOGIN
  // ==========================================

  const handleEmailLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {

      const response = await fetch(

        `${backendUrl}/api/auth/login/email`,

        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          }),

        }

      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.error || "Login failed"
        );

      }

      // SESSION EXISTS
      if (data.session) {

        const { error: sessionError } =
          await supabase.auth.setSession({

            access_token:
              data.session.access_token,

            refresh_token:
              data.session.refresh_token,

          });

        if (sessionError) {

          throw new Error(
            sessionError.message
          );

        }

        // wait slightly before redirect
        setTimeout(() => {

          window.location.href =
            "/dashboard";

        }, 1000);

      } else {

        setMessage(
          "Login successful!"
        );

        setTimeout(() => {

          window.location.href =
            "/dashboard";

        }, 1000);

      }

    } catch (err: any) {

      setMessage(err.message);

    } finally {

      setLoading(false);

    }

  };

  // ==========================================
  // SEND OTP
  // ==========================================

  const handleSendOtp = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    setMessage("");

    let formattedPhone = phone.trim();

    if (
      formattedPhone.length === 10
      && !formattedPhone.startsWith("+")
    ) {

      formattedPhone =
        `+91${formattedPhone}`;

      setPhone(formattedPhone);

    }

    try {

      const response = await fetch(

        `${backendUrl}/api/auth/register/otp/send`,

        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            phone: formattedPhone
          }),

        }

      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.error || "Failed to send OTP"
        );

      }

      setStep("verify");

      setMessage(
        "OTP sent! Please check your phone."
      );

    } catch (err: any) {

      setMessage(err.message);

    } finally {

      setLoading(false);

    }

  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOtp = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {

      const response = await fetch(

        `${backendUrl}/api/auth/register/otp/verify`,

        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            phone,

            token: otpToken

          }),

        }

      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.error || "Failed to verify OTP"
        );

      }

      if (data.data?.session) {

        await supabase.auth.setSession({

          access_token:
            data.data.session.access_token,

          refresh_token:
            data.data.session.refresh_token,

        });

        setTimeout(() => {

          window.location.href =
            "/dashboard";

        }, 1000);

      } else {

        setMessage(
          "Phone verified successfully!"
        );

      }

    } catch (err: any) {

      setMessage(err.message);

    } finally {

      setLoading(false);

    }

  };

  // ==========================================
  // GOOGLE LOGIN
  // ==========================================

  const handleGoogleLogin = async () => {

    try {

      const { error } =
        await supabase.auth.signInWithOAuth({

          provider: "google",

          options: {

            redirectTo:
              `${window.location.origin}/dashboard`,

          },

        });

      if (error) throw error;

    } catch (err: any) {

      setMessage(err.message);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

        {/* Heading */}
        <div>

          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">

            Welcome Back

          </h2>

          <p className="mt-2 text-center text-sm text-gray-500">

            Sign in to your account

          </p>

        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-lg mb-6">

          <button
            onClick={() => {

              setMethod("email");

              setStep("input");

            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              method === "email"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Email
          </button>

          <button
            onClick={() => {

              setMethod("otp");

              setStep("input");

            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              method === "otp"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Mobile OTP
          </button>

        </div>

        {/* Message */}
        {message && (

          <div className="p-3 bg-green-50 border-l-4 border-green-500 text-sm text-green-700">

            {message}

          </div>

        )}

        {/* EMAIL LOGIN */}
        {method === "email" && (

          <form
            className="space-y-5"
            onSubmit={handleEmailLogin}
          >

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">

                Email address

              </label>

              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">

                Password

              </label>

              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 flex justify-center rounded-md text-sm font-bold text-white bg-green-600 hover:bg-green-700"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>

        )}

      </div>

    </div>

  );

}