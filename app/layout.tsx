import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Raqamli maktab — boshqaruv platformasi',
  description: 'Maktab ma’lumotlari, davomat, murojaatlar va inventarni boshqarish uchun yagona platforma.',
  openGraph: {
    title: 'Raqamli maktab — boshqaruv platformasi',
    description: 'Maktab boshqaruvi, ma’lumotlar va tahlil yagona raqamli muhitda.',
    images: ['/digital-school-social.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uz"><body>{children}</body></html>;
}
