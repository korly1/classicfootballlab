import { PublicNav } from "@/components/landing/public-nav";
import { SiteFooter } from "@/components/landing/site-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNav />
      <main className="flex min-h-screen flex-1 flex-col pt-[60px]">{children}</main>
      <SiteFooter />
    </>
  );
}
