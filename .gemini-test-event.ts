import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Creating test event...");
  const event = await prisma.eventListing.create({
    data: {
      slug: "test-qa-event-" + Date.now(),
      title: "Live Database QA Test Ticket",
      category: "parties",
      categoryLabel: "Special QA Party",
      summary: "A fully live test event mapped via Prisma.",
      teaser: "This is a detailed QA event to ensure live rendering checks out.",
      venue: "Dev Main Stage",
      organizer: "BP Testing Team",
      city: "Mumbai",
      startsAt: new Date(Date.now() + 86400000), // Tomorrow
      endsAt: new Date(Date.now() + 172800000), // Day after
      availability: "available",
      priceFrom: 1500,
      posterImage: "https://images.unsplash.com/photo-1540039155733-d7696d440538?w=800",
      description: ["This is a detailed content block generated during the end to end QA test."],
      published: true,
      featured: true,
      hot: true,
      trending: true,
      homepage: true,
    }
  });
  console.log("Created successfully! Slug:", event.slug);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
