import "./globals.css";
import {Providers} from "@src/app/providers";
import {Sidebar} from "@components/Sidebar";
import {SidebarProvider} from "@contexts/SidebarContext";

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <SidebarProvider>
            <div className="flex h-screen bg-background">
              <Sidebar />
              <main className="flex-1 overflow-auto">
                <div className="p-6 lg:p-6 pt-16 lg:pt-6">
                  {children}
                </div>
              </main>
            </div>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}