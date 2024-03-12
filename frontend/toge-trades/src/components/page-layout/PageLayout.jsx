import React from "react";
import { Outlet } from "react-router-dom";

export default function PageLayout() {
    return (
        <React.Fragment>
            <div style={{ margin: '0 10px' }}>
                <Outlet />
            </div>
        </React.Fragment>
    )
}