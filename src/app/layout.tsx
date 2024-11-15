import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "resumee.cloud",
  description: "Create your own online resume in seconds",
  icons: [{ rel: "icon", url: "/logo-color.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
