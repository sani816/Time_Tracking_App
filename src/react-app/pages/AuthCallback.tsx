import { useAuth } from "@getmocha/users-service/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AuthCallback() {
  const { exchangeCodeForSessionToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        await exchangeCodeForSessionToken();
        navigate("/dashboard");
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/");
      }
    };

    handleAuth();
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">Completing sign in...</p>
      </div>
    </div>
  );
}
