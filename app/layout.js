import Navbar from "@/components/Navbar"
import '../styles/globals.css'
import Footer from "@/components/Footer"
export const metadata = {
  title: 'Club C&T',
  description: 'Club de cultura y turismo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{backgroundColor: "#fdfdfd"}}>
          {children}
          <Footer />
      </body>
    </html>
  )
}