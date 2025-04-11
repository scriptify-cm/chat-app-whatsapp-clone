import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 to-zinc-800">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">ChatApp</CardTitle>
          <CardDescription className="text-center">
            Your secure messaging platform
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full" variant="default" size="lg">
              Login
            </Button>
          </Link>
          <Link href="/auth/signup" className="w-full">
            <Button className="w-full" variant="outline" size="lg">
              Sign Up
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
