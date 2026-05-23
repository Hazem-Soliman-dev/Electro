import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-100 to-red-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-orange-950/20 p-4">
      <div className="relative z-10 w-full max-w-md flex justify-center">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/"
          appearance={{
            elements: {
              card: "shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl",
              headerTitle: "text-zinc-950 dark:text-white font-black",
              headerSubtitle: "text-zinc-500 dark:text-zinc-400 font-semibold",
              socialButtonsBlockButton: "border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold",
              formButtonPrimary: "bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-md shadow-orange-500/10",
              footerActionLink: "text-orange-500 hover:text-orange-600 font-bold",
            },
          }}
        />
      </div>
    </div>
  );
}
