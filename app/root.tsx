import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect } from "react";
import headlessuiStyles from "./headlessui.css";
import styles from "./tailwind.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "forester",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: headlessuiStyles },
  { rel: "icon", href: "/icon.png" },
];

export default function App() {
  // headlessuiのportalにスタイルを当てる方法が見つからなかったので
  // querySelectorで無理やりスタイルを変える・・・
  useEffect(() => {
    const portal = document.querySelector<HTMLElement>(
      "#headlessui-portal-root"
    );
    if (portal) {
      portal.style.zIndex = "100";
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
