import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
  } from "@react-email/components";
  import * as React from "react";
  
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

  
  export const EmailTemplate = ({ firstName, id }) => (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Img
            src={'https://clubcyt.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_blue_clubcyt.d8834c86.png&w=256&q=75'}
            width="170"
            height="50"
            alt="Koala"
            style={logo}
          />
          <Text style={paragraph}>Hola {firstName},</Text>
          <Text style={paragraph}>
            Bienvenid@ a Club C&T, haz click en el boton de abajo para verificar tu correo.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={`http://localhost:3000/welcome/${id}`}>
              Verificar correo
            </Button>
          </Section>
          {/* <Text style={paragraph}>
            Best,
            <br />
            The Koala team
          </Text> */}
          <Hr style={hr} />
          {/* <Text style={footer}>
            470 Noor Ave STE B #1148, South San Francisco, CA 94080
          </Text> */}
        </Container>
      </Body>
    </Html>
  );
  
  export default EmailTemplate;
  
  const main = {
    backgroundColor: "#ffffff",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
  };
  
  const logo = {
    margin: "0 auto",
  };
  
  const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
  };
  
  const btnContainer = {
    textAlign: "center",
  };
  
  const button = {
    backgroundColor: "#2a2d84",
    borderRadius: "3px",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center",
    display: "block",
    padding: "12px",
  };
  
  const hr = {
    borderColor: "#cccccc",
    margin: "20px 0",
  };
  
  const footer = {
    color: "#8898aa",
    fontSize: "12px",
  };
  