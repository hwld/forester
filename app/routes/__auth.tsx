import { Outlet } from "@remix-run/react";
import { Logo } from "~/component/Logo";

export default function Auth() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="bg-emerald-400 flex justify-center items-center row-start-2 lg:row-start-1">
        <Logo />
      </div>
      <div className="bg-slate-200 flex justify-center items-center">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
