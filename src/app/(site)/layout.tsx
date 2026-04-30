import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import StoreInitializer from "@/components/store-initializer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StoreInitializer />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
