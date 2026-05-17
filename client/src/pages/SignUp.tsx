import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";

export default function SignUp() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>
            Choose your preferred sign up method
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex justify-center">
            <GoogleLoginButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
