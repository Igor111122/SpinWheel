import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { authenticate } from "../shopify.server";
import {Provider} from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function App() {
  const { apiKey } = useLoaderData();

  const [showProvider, setshowProvider] = useState(false);

  useEffect(()=>{
    setshowProvider(true);
  }, []);

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      {showProvider && (
        <Provider config={shopify.config}>
            <ui-nav-menu>
            <Link to="/app" rel="home">Home</Link>
            <Link to="/app/settings/wheel">Settings wheel</Link>
            <Link to="/app/settings/email">Settings email</Link>
            <Link to="/app/settings/coupon">Settings coupon</Link>
          </ui-nav-menu>
          <Outlet/>
        </Provider>
      )}
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
