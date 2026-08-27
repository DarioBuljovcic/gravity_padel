import type { MouseEvent } from "react";

export const handleScroll = (
  e: MouseEvent<HTMLAnchorElement>,
  href: string,
  pathname: string,
  setIsOpen?: (isOpen: boolean) => void,
) => {
  setIsOpen?.(false);

  const hash = href.startsWith("/#") ? href.slice(2) : null;

  if (pathname !== "/" || hash === null) {
    return;
  }

  e.preventDefault();
  document.body.style.overflow = "unset";

  const scrollToHash = () => {
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", href);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", "/");
  };

  requestAnimationFrame(scrollToHash);
};
