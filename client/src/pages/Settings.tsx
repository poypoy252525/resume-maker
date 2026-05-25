import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Lock, Settings2, Trash2 } from "lucide-react";

function PlaceholderSection({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-dashed bg-muted/30">
      <div className="p-2 rounded-lg bg-muted shrink-0 mt-0.5">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{title}</p>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            Coming soon
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your preferences and account settings
        </p>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general" id="settings-tab-general">
            General
          </TabsTrigger>
          <TabsTrigger value="security" id="settings-tab-security">
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4 mt-0">
          <Card className="border bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Preferences</CardTitle>
              <CardDescription className="text-xs">
                Customize how Resumaker works for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <PlaceholderSection
                icon={Bell}
                title="Notifications"
                description="Control email and in-app notifications for resume activity."
              />
              <PlaceholderSection
                icon={Settings2}
                title="Default Resume Settings"
                description="Set default fonts, margins, and template preferences."
              />
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border border-destructive/30 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
              <CardDescription className="text-xs">
                Irreversible actions — proceed with caution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlaceholderSection
                icon={Trash2}
                title="Delete Account"
                description="Permanently remove your account and all associated data."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4 mt-0">
          <Card className="border bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Security</CardTitle>
              <CardDescription className="text-xs">
                Manage your password and login sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <PlaceholderSection
                icon={Lock}
                title="Change Password"
                description="Update your current password to a new one."
              />
              <PlaceholderSection
                icon={Settings2}
                title="Active Sessions"
                description="View and revoke active login sessions across devices."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />
      <p className="text-xs text-muted-foreground text-center">
        Settings management is coming in a future update.
      </p>
    </div>
  );
}
