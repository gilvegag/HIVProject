import { Reshaped } from 'reshaped';
import 'reshaped/themes/reshaped/theme.css';
import './globals.css';

export const metadata = {
  title: 'HIV Peer Support Platform',
  description: 'Anonymous peer support for people living with HIV in Costa Rica',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Reshaped theme="reshaped" colorMode="light">
          {children}
        </Reshaped>
      </body>
    </html>
  );
}
