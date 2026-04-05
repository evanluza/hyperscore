"use client";

import { track } from "@vercel/analytics";

interface ShareButtonProps {
  address: string;
  className?: string;
}

export function ShareButton({ address, className }: ShareButtonProps) {
  function handleShare() {
    track("share_profile", { address });
    const url = `${window.location.origin}/trader/${address}`;
    const text = `Check out this trader's verified HyperScore profile`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  }

  return (
    <button onClick={handleShare} className={className}>
      Share Profile
    </button>
  );
}
