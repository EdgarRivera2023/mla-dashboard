import "./globals.css"; // This is the crucial line
import Providers from "./components/Providers";

export const metadata = {
  title: "MLA Dashboard",
  description: "Internal dashboard for Medina, Luna & Asociados",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}