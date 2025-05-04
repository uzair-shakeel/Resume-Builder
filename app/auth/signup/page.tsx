"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t, language } = useLanguage();

  const formSchema = z
    .object({
      name: z.string().min(2, {
        message:
          language === "en"
            ? "Name must contain at least 2 characters"
            : "Le nom doit contenir au moins 2 caractères",
      }),
      email: z.string().email({
        message:
          language === "en"
            ? "Invalid email address"
            : "Adresse e-mail invalide",
      }),
      password: z.string().min(6, {
        message:
          language === "en"
            ? "Password must contain at least 6 characters"
            : "Le mot de passe doit contenir au moins 6 caractères",
      }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message:
        language === "en"
          ? "Passwords don't match"
          : "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"],
    });

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            (language === "en"
              ? "An error occurred during registration"
              : "Une erreur est survenue lors de l'inscription")
        );
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (error) {
      setError(
        language === "en"
          ? "An error occurred. Please try again."
          : "Une erreur est survenue. Veuillez réessayer."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {t("auth.register.title")}
          </CardTitle>
          <CardDescription>{t("auth.register.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                {language === "en"
                  ? "Account created successfully! You will be redirected to the login page."
                  : "Compte créé avec succès! Vous allez être redirigé vers la page de connexion."}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("auth.register.name_label")}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t("auth.register.name_placeholder")}
                {...register("name")}
                disabled={isLoading || success}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.register.email_label")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth.register.email_placeholder")}
                {...register("email")}
                disabled={isLoading || success}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {t("auth.register.password_label")}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t("auth.register.password_placeholder")}
                {...register("password")}
                disabled={isLoading || success}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t("auth.register.confirm_password_label")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t("auth.register.confirm_password_placeholder")}
                {...register("confirmPassword")}
                disabled={isLoading || success}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || success}
            >
              {isLoading
                ? language === "en"
                  ? "Signing up..."
                  : "Inscription en cours..."
                : t("auth.register.button")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            {t("auth.register.already_account")}{" "}
            <Link href="/auth/signin" className="text-primary hover:underline">
              {t("auth.register.log_in")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
