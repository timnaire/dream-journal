import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Box } from "@mui/material";

export function BaseLayout() {
    return (
        <>
            <Header />
            <Box component="main" sx={{ height: '100%' }}>
                main content here
                <Outlet />
                <h1 className="text-3xl font-bold underline">
                    Hello world!
                </h1>
            </Box>
            <footer>Footer</footer>
        </>
    );
}