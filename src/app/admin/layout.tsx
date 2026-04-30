"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  Lock,
  ShieldAlert,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [showPasskey, setShowPasskey] = useState(false);
  const [error, setError] = useState("");

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loginAttempts = useAuthStore((s) => s.loginAttempts);
  const lastAttempt = useAuthStore((s) => s.lastAttempt);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const isLockedOut = loginAttempts >= 5 && Date.now() - lastAttempt < 60_000;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLockedOut) {
      setError("Too many failed attempts. Please wait 60 seconds.");
      return;
    }

    const success = login(passkey);
    if (!success) {
      setPasskey("");
      const remaining = 5 - (loginAttempts + 1);
      if (remaining <= 0) {
        setError("Locked out. Wait 60 seconds before trying again.");
      } else {
        setError(
          `Invalid passkey. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
        );
      }
    }
  };

  // --- LOGIN GATE ---
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border bg-card p-8 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Lock className="h-7 w-7" />
              </div>
              <h1 className="mt-4 text-xl font-bold tracking-tight">
                Restricted Access
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Enter the admin passkey to continue.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="passkey" className="text-sm font-medium">
                  Passkey
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="passkey"
                    type={showPasskey ? "text" : "password"}
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter admin passkey"
                    className="pr-10"
                    autoComplete="off"
                    autoFocus
                    disabled={isLockedOut}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasskey(!showPasskey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPasskey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLockedOut || !passkey}
              >
                Access Dashboard
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                &larr; Return to website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl">
              <Image
                src="/danmes-logo.jpeg"
                alt="Prime Danmes logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight leading-tight">
                PRIME DANMES
              </p>
              <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                Admin Panel
              </p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <link.icon className="h-4.5 w-4.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t px-3 py-4 space-y-1">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <Lock className="h-4.5 w-4.5" />
            Lock Dashboard
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-4.5 w-4.5" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b bg-card px-4 py-3 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold tracking-tight">
            Admin Dashboard
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
