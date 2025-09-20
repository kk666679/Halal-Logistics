import './globals.css'

export const metadata = {
  title: 'Halal Logistics Dashboard',
  description: 'Dashboard for Halal Logistics Framework',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
