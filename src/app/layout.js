import "./globals.css";
import Providers from "./components/Providers";
import { Toaster } from "react-hot-toast"; // <-- 1. Import Toaster

export const metadata = {
  title: "MLA Dashboard",
  description: "Internal dashboard for Medina, Luna & Asociados",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster /> {/* <-- 2. Add Toaster component here */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}