import { Outlet, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

function getBreadcrumb(pathname: string): string {
  const map: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/resumes": "My Resumes",
    "/dashboard/activity": "Recent Activity",
    "/dashboard/favorites": "Favorites",
    "/dashboard/profile": "Profile",
    "/dashboard/settings": "Settings",
  };
  return map[pathname] ?? "Dashboard";
}

/**
 * DashboardLayout — wraps authenticated pages with sidebar navigation
 */
export default function DashboardLayout() {
  const { isAuthenticated, fetchUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, fetchUser]);

  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{getBreadcrumb(location.pathname)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Page content */}
        <main className="flex flex-1 flex-col gap-4 p-6">
          <Outlet />
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
