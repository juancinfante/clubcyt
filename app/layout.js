import Navbar from "@/components/Navbar"
import '../styles/globals.css'
import Footer from "@/components/Footer"

export const metadata = {
  title: 'Club C&t',
  description: 'Club de cultura y turismo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body style={{backgroundColor: "#fdfdfd"}} className="">
          {children}
          <Footer />
      </body>
    </html>
  )
}
