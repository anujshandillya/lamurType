import Form from "@/components/Auth/Form";
import { useAuthContext } from "@/context/User/UserAuthContext";
import useProfile from "@/hooks/use-profile";
import { useRouter } from "@/hooks/use-router";
import { useEffect } from "react";
import { Link } from "react-router-dom";

type AuthProps = {
  type: "login" | "register";
};

export default function Auth({ type }: AuthProps) {
  const { router } = useRouter()
  const { user, dispatch } = useAuthContext()

  useEffect(() => {
    if (user.isAuthenticated) {
      dispatch({ type: 'SET_USER', payload: user })
      router.replace('/')
    }
  }, [user.isAuthenticated])
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg to-hl/20 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-fg/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fg/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fg/3 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Card container */}
        <div className="bg-bg/80 backdrop-blur-xl border border-fg/10 rounded-2xl shadow-2xl shadow-fg/5 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-fg to-fg/70 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-bg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {type === "login" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                )}
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-fg mb-2">
              {type === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-hl text-sm">
              {type === "login"
                ? "Sign in to your account to continue"
                : "Join us and start your journey"}
            </p>
          </div>

          {/* Form */}
          <Form type={type} />

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-hl text-sm">
              {type === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <Link
                className="text-fg font-medium hover:text-fg/80 transition-colors duration-200 underline decoration-fg/30 underline-offset-2 hover:decoration-fg/60"
                to={type === "login" ? "/auth/register" : "/auth/login"}
              >
                {type === "login" ? "Sign up" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-hl/60 text-xs">
            <div className="w-2 h-2 bg-fg/20 rounded-full"></div>
            <div className="w-2 h-2 bg-fg/20 rounded-full"></div>
            <div className="w-2 h-2 bg-fg/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
