import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const { setToken, fetchUser } = useAuthStore();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/google/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              access_token: tokenResponse.access_token,
            }),
          }
        );

        const data = await response.json();
        console.log("Login success:", data);

        if (data.key) {
          setToken(data.key);
          await fetchUser();
          navigate("/app");
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <Button
      variant="outline"
      onClick={() => login()}
      className="flex items-center gap-2"
    >
      Sign in with Google
    </Button>
  );
}

