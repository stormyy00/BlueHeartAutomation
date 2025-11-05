import { ErrorContext } from "better-auth/react";
import { signIn } from "./auth-client";

const SignInProvider = async (provider: string) =>
  await signIn.social(
    {
      provider: provider,
      callbackURL: "/",
    },
    {
      onSuccess: async () => {},
      onError: (ctx: ErrorContext) => {
        console.error("Sign in error:", ctx.error.message);
        alert(ctx.error.message ?? "Something went wrong.");
      },
    },
  );

export default SignInProvider;
