import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithEmail } from "@/lib/auth";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await signUpWithEmail({ fullName, email, password });
      const emailExists = !!result.user?.email;
      if (emailExists) {
        toast.success("Pendaftaran berhasil. Cek email Anda untuk verifikasi.");
      }
      navigate({ to: "/auth/login" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Pendaftaran gagal.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4 py-10">
      <Card className="w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Daftar Akun</CardTitle>
          <CardDescription>Buat akun baru untuk menyimpan data lamaran dan history pekerjaan Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama lengkap</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Mendaftar..." : "Daftar"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Sudah punya akun? {" "}
            <Link to="/auth/login" className="font-semibold text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
