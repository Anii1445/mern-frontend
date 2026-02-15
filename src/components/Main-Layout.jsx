import { Outlet } from "react-router-dom";
import NavbarLayout from "./Navbar-Layout";
import Footer from "./Footer";


export default function MainLayout() {
  return (
    <>
      <NavbarLayout />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
