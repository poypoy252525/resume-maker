import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '../ui/button';
import { LogIn } from 'lucide-react';

export default function GoogleLoginButton() {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      // Send tokenResponse.access_token to backend
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: tokenResponse.access_token,
          }),
        });
        
        const data = await response.json();
        console.log('Login success:', data);
        
        // Save token to localStorage or state
        if (data.key) {
           localStorage.setItem('auth_token', data.key);
           // Reload or redirect
           window.location.reload();
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    onError: (error) => console.log('Login Failed:', error),
  });

  return (
    <Button 
      variant="outline" 
      onClick={() => login()}
      className="flex items-center gap-2"
    >
      <LogIn className="w-4 h-4" />
      Sign in with Google
    </Button>
  );
}
