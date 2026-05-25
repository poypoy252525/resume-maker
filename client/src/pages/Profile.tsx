import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/useAuthStore";
import { Mail, User } from "lucide-react";

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="p-2 rounded-lg bg-muted shrink-0">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-sm font-medium truncate mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuthStore();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Your account information
        </p>
      </div>

      {/* ── Avatar Card ── */}
      <Card className="border bg-card/60">
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <Avatar className="size-16 rounded-2xl">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="rounded-2xl bg-primary/10 text-primary text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{user?.name ?? "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email ?? ""}</p>
              <Badge variant="secondary" className="mt-2 text-xs">
                Free Plan
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Details Card ── */}
      <Card className="border bg-card/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Account Details</CardTitle>
          <CardDescription className="text-xs">
            Your personal information as stored in Resumaker
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border">
            <InfoRow icon={User} label="Full Name" value={user?.name ?? ""} />
            <InfoRow icon={Mail} label="Email Address" value={user?.email ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* ── Placeholder notice ── */}
      <p className="text-xs text-muted-foreground text-center">
        Profile editing and avatar upload coming soon.
      </p>
    </div>
  );
}
