"use client";
import Link from "next/link";
import { useState } from "react";

interface TabProps {
  name: string;
  link: string;
}

export default function Tab(Tab: TabProps[]) {
  const [selected, setSelected] = useState<boolean>(false);
  return (
    <div className="bg-gray-300 rounded-md p-3">
      {Tab.map((t) => (
        <Link href={t.link} className={selected? "bg-white text-primary-main rounded-md" : "bg-gray-300 text-gray-800"}>
          {t.name}
        </Link>
      ))}
    </div>
  );
}
