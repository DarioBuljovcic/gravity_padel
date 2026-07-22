import AuthPage from "@/components/auth/AuthPage";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <AuthPage searchParams={searchParams} />
  );
}
