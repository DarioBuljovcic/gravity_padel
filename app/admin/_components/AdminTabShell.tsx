"use client";

import { Activity, useEffect, useState, type ReactNode } from "react";

export type AdminTab = "blogs" | "gallery" | "reservations" | "statistics";

const TABS: { id: AdminTab; label: string }[] = [
  { id: "blogs", label: "Blogovi" },
  { id: "gallery", label: "Galerija" },
  { id: "reservations", label: "Rezervacije" },
  { id: "statistics", label: "Statistika" },
];

type AdminTabShellProps = {
  initialTab: AdminTab;
  blogs: ReactNode;
  gallery: ReactNode;
  reservations: ReactNode;
  statistics: ReactNode;
};

export default function AdminTabShell({
  initialTab,
  blogs,
  gallery,
  reservations,
  statistics,
}: AdminTabShellProps) {
  const [tab, setTab] = useState<AdminTab>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  function selectTab(next: AdminTab) {
    setTab(next);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }

  const tabClass = (id: AdminTab) =>
    `pb-4 text-xs md:text-base w-fit font-black uppercase tracking-[0.2em] transition-all duration-300 border-b-2 ${tab === id
      ? "text-primary-orange border-primary-orange"
      : "text-slate-500 border-transparent hover:text-white"
    }`;

  return (
    <>
      <div className="flex sm:items-center sm:justify-center gap-8 mb-12 border-b border-white/10 px-2 lg:px-0 overflow-x-scroll scrollbar-hide sm:overflow-x-hidden">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => selectTab(id)}
            className={tabClass(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <Activity mode={tab === "blogs" ? "visible" : "hidden"}>{blogs}</Activity>
      <Activity mode={tab === "gallery" ? "visible" : "hidden"}>
        {gallery}
      </Activity>
      <Activity mode={tab === "reservations" ? "visible" : "hidden"}>
        {reservations}
      </Activity>
      <Activity mode={tab === "statistics" ? "visible" : "hidden"}>
        {statistics}
      </Activity>
    </>
  );
}
