import { AdminEventsClient } from "@/components/admin/AdminEventsClient";
import { getAdminEventListings } from "@/lib/admin/control-center";
import { prisma } from "@/lib/prisma";

type AdminEventsPageProps = {
  searchParams?: {
    success?: string;
    error?: string;
    deleted?: string;
    cloned?: string;
  };
};

export default async function AdminEventsPage({ searchParams }: AdminEventsPageProps) {
  const [eventListings, revenueAggregate] = await Promise.all([
    getAdminEventListings(),
    prisma.eventBooking.aggregate({
      where: { status: "confirmed" },
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
  ]);

  const featuredCount = eventListings.filter((item) => item.featured).length;
  const hotCount = eventListings.filter((item) => item.hot).length;
  const publishedCount = eventListings.filter((item) => item.published).length;
  const totalRevenue = revenueAggregate._sum.totalAmount ?? 0;
  const totalTickets = revenueAggregate._count._all;

  return (
    <AdminEventsClient
      eventListings={eventListings}
      publishedCount={publishedCount}
      featuredCount={featuredCount}
      hotCount={hotCount}
      totalRevenue={totalRevenue}
      totalTickets={totalTickets}
      successMessage={searchParams?.success}
      deletedMessage={searchParams?.deleted}
      clonedMessage={searchParams?.cloned}
      errorMessage={searchParams?.error}
    />
  );
}
