"use client";

import Link from "next/link";
import { useLogin } from "../../features/login/hooks/useLogin";

export default function LoginPage() {
  const {
    email,
    setEmail,
    message,
    otp,
    showOtp,
    inputRefs,
    handleSubmit,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpSubmit,
    handleBackToEmail,
    isRequestingToken,
    isVerifyingToken,
    isRequestError,
  } = useLogin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
      <main className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4 z-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-red-400">
          🎄 Login to Secret Santa 🎄
        </h1>
        <p className="text-gray-300 mb-6 text-center">
          Enter your email to receive a login token
        </p>

        {!showOtp ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isRequestingToken}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
              {isRequestingToken ? "Sending..." : "Send Login Token"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Enter 6-digit code
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
                    required
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifyingToken || otp.some((d) => !d)}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
              {isVerifyingToken ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={handleBackToEmail}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
              Back to Email
            </button>
          </form>
        )}

        {message && (
          <div
            className={`mt-4 p-3 rounded-md text-center ${
              isRequestError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
