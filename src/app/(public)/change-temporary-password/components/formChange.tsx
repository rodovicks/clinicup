"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import axios from "axios";

const schema = yup.object().shape({
  temporaryPassword: yup.string().required("Senha temporária é obrigatória"),
  newPassword: yup
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .matches(/[0-9]/, "A senha deve conter pelo menos um número")
    .matches(
      /[@$!%*?&]/,
      "A senha deve conter pelo menos um caractere especial"
    )
    .required("Nova senha é obrigatória"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "As senhas não coincidem")
    .required("Confirmação de senha é obrigatória"),
});

export default function FormChangePassword() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const router = useRouter();
  interface ChangePasswordFormInputs {
    temporaryPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }

  const onSubmit = async (data: ChangePasswordFormInputs) => {
    setLoading(true);
    try {
      await axios.post("/api/reset-temporary-password", {
        ...data,
      });
      toast.success(
        "Senha alterada com sucesso. Você será redirecionado para o login."
      );
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      toast.error(error.response?.data?.message || "Erro ao alterar a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-8 w-full max-w-md shadow-md">
        <div className="flex flex-col items-center justify-center gap-4 mb-4">
          <Activity className="w-10 h-10 mr-2 text-sky-500" />

          <h1 className="text-2xl font-bold text-center text-sky-500">
            Clinic Up
          </h1>
        </div>
        <h2 className="text-lg font-semibold text-center mb-6">
          Alterar Senha
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label
              htmlFor="temporaryPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Senha Temporária
            </Label>
            <Input
              id="temporaryPassword"
              type="password"
              placeholder="Digite sua senha temporária"
              className={`mt-1 w-full ${
                errors.temporaryPassword ? "border-red-500" : ""
              }`}
              {...register("temporaryPassword")}
            />
            {errors.temporaryPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.temporaryPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Nova Senha
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Digite sua nova senha"
              className={`mt-1 w-full ${
                errors.newPassword ? "border-red-500" : ""
              }`}
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmar Nova Senha
            </Label>
            <Input
              id="confirmNewPassword"
              type="password"
              placeholder="Confirme sua nova senha"
              className={`mt-1 w-full ${
                errors.confirmNewPassword ? "border-red-500" : ""
              }`}
              {...register("confirmNewPassword")}
            />
            {errors.confirmNewPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={async () => {
                await signOut({ redirect: false });
                router.push("/login");
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Alterando..." : "Alterar Senha"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
