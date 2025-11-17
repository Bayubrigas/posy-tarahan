'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Baby,
  TrendingUp,
  MapPin,
  FileText,
  Settings,
  Home,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Menu Utama',
    items: [
      {
        label: 'Home',
        icon: Home,
        href: '/',
      },
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
      },
    ],
  },
  {
    title: 'Data Management',
    items: [
      {
        label: 'Data Anak',
        icon: Baby,
        href: '/anak',
      },
      {
        label: 'Data Posyandu',
        icon: Users,
        href: '/posyandu',
      },
      {
        label: 'Perkembangan',
        icon: TrendingUp,
        href: '/perkembangan',
      },
    ],
  },
  {
    title: 'Lainnya',
    items: [
      {
        label: 'Peta Lokasi',
        icon: MapPin,
        href: '/peta',
      },
      {
        label: 'Laporan',
        icon: FileText,
        href: '/laporan',
      },
      {
        label: 'Pengaturan',
        icon: Settings,
        href: '/settings',
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="px-3 space-y-6">
          {menuItems.map((section, idx) => (
            <div key={idx}>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                        isActive
                          ? 'bg-purple-50 text-purple-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2 bg-purple-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Admin
            </p>
            <p className="text-xs text-gray-500 truncate">
              admin@posyandu.id
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}