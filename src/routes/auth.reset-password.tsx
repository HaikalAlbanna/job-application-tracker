import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exchangeResetCode, updatePassword } from "@/lib/auth";

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingLink, setIsCheckingLink] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      setIsCheckingLink(false);
      return;
    }

    exchangeResetCode(code)
      .catch((error) => {
        console.error(error);
        toast.error("Link reset password tidak valid atau sudah kadaluarsa.");
      })
      .finally(() => setIsCheckingLink(false));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await updatePassword(newPassword);
      toast.success("Password berhasil diubah.");
      navigate({ to: "/auth/login" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal mengubah password.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingLink) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-10">
        <Card className="w-full shadow-xl">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">Memvalidasi link reset password...</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-10">
      <Card className="w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Buat Password Baru</CardTitle>
          <CardDescription>Masukkan password baru untuk akun Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Password baru</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Password"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            <Link to="/auth/login" className="font-semibold text-primary hover:underline">
              Kembali ke Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
