import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import StoreInitializer from "@/components/store-initializer";
import { SiteSettingsProvider } from "@/components/site-settings-provider";
import { getSiteSettings } from "@/lib/repository";
import { defaultSiteSettings } from "@/lib/site-settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings().catch(() => defaultSiteSettings);

  return (
    <SiteSettingsProvider initialSettings={settings}>
      <StoreInitializer />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </SiteSettingsProvider>
  );
}
