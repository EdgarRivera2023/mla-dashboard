import "./globals.css";
import Providers from "../components/Providers";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "MLA Dashboard",
  description: "Internal dashboard for Medina, Luna & Asociados",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Toaster /> 
          {children}
        </Providers>
      </body>
    </html>
  );
}