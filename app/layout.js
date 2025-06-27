import '../styles/globals.css'
import Footer from "@/components/Footer"
import Provider from "./Provider"
import Image from 'next/image'

export default function RootLayout({ children }) {

  return (
    <html lang="en" dir="ltr">
      <Provider>
        <body style={{ backgroundColor: "#fdfdfd" }} className="">
          {/* <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/6753d1e42480f5b4f5a9494e/1iefmnq0g';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
            }}
          /> */}
          {children}
          <Footer />
        </body>
      </Provider>
    </html>
  )
}
