import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ================= Top ================= */}
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <h2 className="footer-logo">Zomato</h2>
            <p className="footer-tagline">
              Fresh food from your favourite restaurants, delivered fast at your
              doorstep.
            </p>
          </div>

          {/* Links */}
          <div className="footer-links">
            <div className="footer-column">
              <h4>Explore</h4>
              <Link href="/">Home</Link>
              <Link href="/orders">My Orders</Link>
              <Link href="/cart">Cart</Link>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact Us</Link>
              <Link href="/careers">Careers</Link>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms & Conditions</Link>
              <Link href="/refund">Refund Policy</Link>
            </div>
          </div>
        </div>

        {/* ================= Bottom ================= */}
        <div className="footer-bottom">
          <p>© {year} Zomato. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
