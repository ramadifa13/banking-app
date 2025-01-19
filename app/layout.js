import "./globals.css";

export const metadata = {
  title: "Banking App",
  description: "Create by Ramadifa esa putra",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        </body>
    </html>
  );
}
