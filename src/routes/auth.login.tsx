import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail } from "@/lib/auth";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Login — Job Tracker" },
      { name: "description", content: "Masuk ke akun Job Tracker Anda untuk mengelola lamaran kerja." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await signInWithEmail({ email, password });
      toast.success("Login berhasil! Mengalihkan ke dashboard...");
      navigate({ to: "/" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login gagal. Periksa email dan password Anda.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-10">
      <Card className="w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Masuk</CardTitle>
          <CardDescription>Masukkan email dan password untuk mengakses akun Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  minLength={6}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 size-4" />
                  Masuk
                </>
              )}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link to="/auth/register" className="font-semibold text-primary hover:underline">
              Daftar di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
