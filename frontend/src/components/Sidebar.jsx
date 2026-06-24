import React from 'react'
import {
  LayoutDashboard,
  Building2,
  Brain,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

const Sidebar = ({active}) => {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Stores", icon: Building2, href: "/stores" },
    { label: "Forecast", icon: Brain, href: "/forecast" },
    // { label: "StoreDetails", icon: Brain, href: "/store/{id} },
  ];

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col p-5">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-2 h-2 rounded-full bg-emerald-600" />
        <span className="text-sm font-medium text-gray-900">RetailLensAI</span>
      </div>

      <nav className="space-y-0.5">
        {items.map(({ label, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${active === label
              ? "bg-emerald-50 text-emerald-800 font-medium"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
          >
            <Icon size={16} />
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar
