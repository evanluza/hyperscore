"use client";

import { track } from "@vercel/analytics";
import { HL_REFERRAL_URL } from "@/lib/constants";

interface ReferralLinkProps {
  className?: string;
  children: React.ReactNode;
  location: string;
}

export function ReferralLink({ className, children, location }: ReferralLinkProps) {
  return (
    <a
      href={HL_REFERRAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track("referral_click", { location })}
    >
      {children}
    </a>
  );
}
