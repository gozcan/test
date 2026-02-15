import { NavLink } from "react-router-dom";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/expenses", label: "Expenses" },
  { href: "/settings", label: "Settings" }
];

export function SidebarNav() {
  return (
    <nav className="sidebar" aria-label="Primary">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/"}
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
