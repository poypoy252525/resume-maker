import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";

export default function SignUp() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md mx-4 shadow-none">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>
            Choose your preferred sign up method to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <GoogleLoginButton className="w-full justify-center" />
        </CardContent>
      </Card>
    </div>
  );
}
