import type { Route } from "./+types/_authenticated";
import { Link, Outlet, redirect } from "react-router";
import { getMe } from "~/api/nagaraCareAPI";
import { Button } from "~/components/ui/button";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  if (!localStorage.getItem("token")) {
    return redirect("/login");
  }
  try {
    const me = await getMe();
    if (me.role !== "GLOBAL_ADMIN") {
      localStorage.removeItem("token");
      return redirect("/login");
    }
    return { me };
  } catch (error) {
    localStorage.removeItem("token");
    return redirect("/login");
  }
}

export default function AuthenticatedLayout({
  loaderData,
}: Route.ComponentProps) {
  const { me } = loaderData;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* 左側: ブランドロゴとナビゲーション */}
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="flex items-center text-xl font-bold transition-colors hover:text-primary"
              >
                ながらかいご
              </Link>
              <Link
                to="/tenants"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                施設一覧
              </Link>
            </div>

            {/* 右側: ユーザー情報とログアウト */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {me.loginId} さん
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="font-medium hover:bg-destructive/10 hover:text-destructive"
              >
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
