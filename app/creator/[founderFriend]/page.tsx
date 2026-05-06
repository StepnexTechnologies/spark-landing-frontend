import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllFounderReferralSlugs,
  getFounderReferral,
} from "@/lib/data/founder-referrals";
import CreatorFounderInvitePage from "./CreatorFounderInvitePage";

type Props = {
  params: Promise<{ founderFriend: string }>;
};

export function generateStaticParams() {
  return getAllFounderReferralSlugs().map((founderFriend) => ({ founderFriend }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { founderFriend } = await params;
  const data = getFounderReferral(founderFriend);
  if (!data) return {};

  const title = `${data.friend.name}, ${data.founder.name} from Sparkonomy has a gift for you`;
  const description = `Exclusively for ${data.friend.name}'s referrals — first year free.`;
  const url = `https://www.sparkonomy.com/creator/${data.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: Props) {
  const { founderFriend } = await params;
  const data = getFounderReferral(founderFriend);
  if (!data) notFound();
  return <CreatorFounderInvitePage data={data} />;
}
