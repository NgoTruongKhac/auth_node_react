import Navbar from "../components/navbar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div>
      <div className="mb-3">
        <Navbar />
      </div>
      <Outlet />
    </div>
  );
}
