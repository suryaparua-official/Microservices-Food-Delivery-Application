import "./globals.css";
import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/footer/Footer";
import { CartProvider } from "@/src/context/CartContext";
import { LocationProvider } from "@/src/context/LocationContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="layout-body">
        <CartProvider>
          <LocationProvider>
            <Navbar />
            <main className="layout-main">{children}</main>
            <Footer />
          </LocationProvider>
        </CartProvider>
      </body>
    </html>
  );
}
