import { usePathname } from "next/navigation";

export const handleScroll = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  setIsOpen: (isOpen: boolean) => void,
) => {
  const pathname = usePathname();

  const hash = href.startsWith("/#") ? href.slice(2) : null;

  if (pathname === "/" && hash !== null) {
    e.preventDefault();

    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", href);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", "/");
    }

    setIsOpen(false);
    return;
  }

  // Let Next.js navigate from non-home pages; the hash target is scrolled
  // into view after the root page renders.
  setIsOpen(false);
};
