import { authRoutes } from "@plotkeys/auth/shared";
import { redirect } from "next/navigation";

type SignUpPageProps = {
  searchParams?: Promise<{
    redirect?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = (await searchParams) ?? {};
  const redirectTo = params.redirect
    ? `${authRoutes.signIn}?redirect=${encodeURIComponent(params.redirect)}`
    : authRoutes.signIn;
  redirect(redirectTo);
}
