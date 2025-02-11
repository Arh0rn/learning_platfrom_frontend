import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container } from "@mui/material";

const MainLayout = () => {
    return (
        <>
            <Header />
            <Container sx={{ minHeight: "80vh", mt: 4 }}>
                <Outlet />{" "}
                {/* ВАЖНО: Это то место, где будут рендериться страницы */}
            </Container>
            <Footer />
        </>
    );
};

export default MainLayout;
