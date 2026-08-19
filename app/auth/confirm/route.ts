import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  if (token_hash && type === "recovery") {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type: "recovery",
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(new URL("/reset-password", url.origin));
    }
  }

  return NextResponse.redirect(
    new URL("/forgot-password?error=invalid_link", url.origin),
  );
}
