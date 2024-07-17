import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Box } from "@mui/material";

export function BaseLayout() {
    return (
        <>
            <Header />
            <Box component="main" sx={{ height: '100%' }}>
                <Outlet />
            </Box>
            {/* <footer>Footer</footer> */}
        </>
    );
}