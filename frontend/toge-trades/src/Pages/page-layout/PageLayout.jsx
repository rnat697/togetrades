import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import GlobalNavigation from "../../components/global-navigation/GlobalNavigation";

export default function PageLayout() {
  const location = useLocation();
  const hideGlobalNav = ["/login", "/landing", "/signup"].includes(
    location.pathname
  );

  return (
    <React.Fragment>
      {!hideGlobalNav && <GlobalNavigation />}
      <div style={{ justifyContent: "center", alignItems: "center" }}>
        <Outlet />
      </div>
    </React.Fragment>
  );
}
