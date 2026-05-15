import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ResponsiveLayout>{children}</ResponsiveLayout>;
}
