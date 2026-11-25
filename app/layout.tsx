import type { Metadata, Viewport } from 'next'
import './globals.css'
export const metadata: Metadata={title:'MM Interactive Parts Diagram | DeWALT DC608',description:'Explore the DeWALT DC608 Type 1 exploded parts diagram, find figure numbers and browse replacement parts.',icons:{icon:'/gear.png'}}
export const viewport:Viewport={colorScheme:'light',themeColor:'#ffb500'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
