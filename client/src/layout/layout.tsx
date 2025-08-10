import Navbar from "../components/navbar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div>
      <div className="mb-2">
        <Navbar />
      </div>
      <Outlet />
    </div>
  );
}
