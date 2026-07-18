import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "FarmConnect",
  description: "Farmer-Dealer Marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}