  import Header from "../components/Header";
  import Footer from "../components/Footer";
  import { Container } from "@mui/material";

  function MainLayout({ children }) {
    return (
      <>
        <Header />
        <Container sx={{ minHeight: "80vh", mt: 3 }}>{children}</Container>
        <Footer />
      </>
    );
  }

  export default MainLayout;
