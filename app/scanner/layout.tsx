import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Door Scanner | Nyx',
  description: 'Event entry scanner',
};

export default function ScannerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {children}
    </div>
  );
}
