export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
