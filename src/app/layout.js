import "./globals.css";
import Providers from "./components/Providers"; // 1. IMPORT our provider

export const metadata = {
  title: "MLA Dashboard",
  description: "Internal dashboard for Medina, Luna & Asociados",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers> {/* 2. WRAP the children */}
          {children}
        </Providers>
      </body>
    </html>
  );
}