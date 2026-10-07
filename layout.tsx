import './globals.css';
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
export const metadata: Metadata={title:'ResQLink — Emergency Response Network',description:'AI-enabled disaster-response coordination platform'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
