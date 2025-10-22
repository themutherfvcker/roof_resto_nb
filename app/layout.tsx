// app/layout.tsx
import './globals.css'

import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'


export const metadata = {
  title: 'Roof Restoration – Northern Beaches',
  description: 'Licensed & insured roof restorations across the Northern Beaches. Free quotes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <div className="container">{children}</div>
        <SiteFooter />
      </body>
    </html>
  )
}
