// app/layout.tsx
import './globals.css'

export const metadata = {
  title: 'Roof Restoration – Northern Beaches',
  description: 'Licensed & insured roof restorations across the Northern Beaches. Free quotes.',
}

// Inline header + footer so we don’t rely on external component paths
function SiteHeader() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">Roof Restoration – Northern Beaches</div>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="tel:+611300000000">Call 1300 000 000</a>
          <a href="/sitemap.xml">Sitemap</a>
        </nav>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} Northern Beaches Roof Restoration · Licensed & Insured · ABN 00 000 000 000
    </footer>
  )
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
