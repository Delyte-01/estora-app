import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { properties, getPropertyBySlug } from "@/data/properties";
import PropertyDetail from "@/components/propertyDetail";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    return { title: "Property Not Found | ESTORA Property Group" };
  }

  return {
    title: `${property.title} — ${property.location} | ESTORA`,
    description: property.description.slice(0, 160),
    openGraph: {
      title: `${property.title} — ${property.location} | ESTORA`,
      description: property.description.slice(0, 160),
      type: "website",
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const related = properties
    .filter((p) => p.id !== property.id && p.city === property.city)
    .slice(0, 3);

  return <PropertyDetail property={property} related={related} />;
}