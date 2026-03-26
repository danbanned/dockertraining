"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  {
    label: "Planning",
    items: [
      { href: "/onboarding", label: "Onboarding" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/tasks", label: "Tasks" },
      { href: "/weekly-review", label: "Weekly Review" },
    ],
  },
  {
    label: "Tracking",
    items: [
      { href: "/jobs", label: "Jobs" },
      { href: "/skills", label: "Skills" },
      { href: "/fitness", label: "Fitness" },
      { href: "/progress", label: "Progress" },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { href: "/decisions", label: "Decisions" },
    ],
  },
  { href: "/settings", label: "Settings" },
];

export function Navigation() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState(null);

  const isActiveLink = (href) => pathname === href;

  const isActiveDropdown = (dropdownItems) => {
    return dropdownItems.some((item) => isActiveLink(item.href));
  };

  return (
    <nav className="nav">
      <Link href="/" className="brand">
        BrightPath
      </Link>
      <div className="nav-links">
        {navItems.map((item, index) => {
          // Handle regular links
          if (item.href) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActiveLink(item.href) ? "nav-link active" : "nav-link"}
              >
                {item.label}
              </Link>
            );
          }

          // Handle dropdowns
          const isOpen = openDropdown === item.label;
          const hasActiveChild = isActiveDropdown(item.items);

          return (
            <div
              key={item.label}
              className={`dropdown ${isOpen ? "open" : ""}`}
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className={`dropdown-trigger ${hasActiveChild ? "active" : ""}`}
                onClick={() => setOpenDropdown(isOpen ? null : item.label)}
              >
                {item.label}
                <svg
                  className={`dropdown-arrow ${isOpen ? "rotated" : ""}`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="dropdown-menu">
                {item.items.map((dropdownItem) => (
                  <Link
                    key={dropdownItem.href}
                    href={dropdownItem.href}
                    className={isActiveLink(dropdownItem.href) ? "dropdown-item active" : "dropdown-item"}
                    onClick={() => setOpenDropdown(null)}
                  >
                    {dropdownItem.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
