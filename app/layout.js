import "./globals.css";

export const metadata = {
  title: "BrightPath",
  description: "AI-powered life and career acceleration platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
