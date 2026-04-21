import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ашт - Объявления и вакансии',
  description: 'Платформа объявлений и вакансий',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
