import Navbar from "../components/navbar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="max-w-full w-[75%] border-1 h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}
