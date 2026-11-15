import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPolicy } from "@/lib/data/policies";

interface PolicyPageProps {
  params: Promise<{
    country: string;
    locale: string;
    slug: string;
  }>;
}

// Preview-only fallback: avoid uncached policy API requests during
// Next.js Cache Components metadata prerendering.
export const metadata: Metadata = {
  title: "Store Policies",
  description: "Store policies and information.",
};

export default async function PolicyPage({
  params,
}: PolicyPageProps): Promise<React.JSX.Element> {
  const { country, slug, locale } = await params;
  const [policy, t] = await Promise.all([
    getPolicy(slug, { country, locale }),
    getTranslations({ locale: locale as Locale, namespace: "policies" }),
  ]);

  if (!policy) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{policy.name}</h1>
      {policy.body_html ? (
        <div
          className="prose prose-gray"
          dangerouslySetInnerHTML={{ __html: policy.body_html }}
        />
      ) : policy.body ? (
        <div className="prose prose-gray whitespace-pre-wrap">
          {policy.body}
        </div>
      ) : (
        <p className="text-gray-500">{t("noContent")}</p>
      )}
    </div>
  );
}

