import './globals.css';

export const metadata = {
  title: 'Groundwater Monitoring',
  description: 'Prototype groundwater monitoring app'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
