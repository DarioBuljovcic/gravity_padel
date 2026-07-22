
import AuthPage from "@/components/auth/AuthPage";

type SignupPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {


  return (
    <AuthPage searchParams={searchParams} />
  );
}
