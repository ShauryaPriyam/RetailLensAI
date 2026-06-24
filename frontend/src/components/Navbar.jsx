import { Bell, Search } from "lucide-react";

const Navbar = ({ title, subtitle }) => {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
          <Search size={16} />
        </button>
        <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
          <Bell size={16} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;