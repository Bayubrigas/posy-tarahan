import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  Sistem Informasi
                </div>
                <div className="text-xs text-gray-400">
                  Data Posyandu
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Sistem informasi terintegrasi untuk pengelolaan data posyandu dan perkembangan kesehatan anak di Indonesia.
            </p>
            <p className="text-xs text-gray-500">
              © 2024 Sistem Posyandu. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tentang" className="text-sm hover:text-purple-400 transition-colors">
                  Tentang
                </Link>
              </li>
              <li>
                <Link href="/anak" className="text-sm hover:text-purple-400 transition-colors">
                  Data Anak
                </Link>
              </li>
              <li>
                <Link href="/posyandu" className="text-sm hover:text-purple-400 transition-colors">
                  Data Posyandu
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm hover:text-purple-400 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm hover:text-purple-400 transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-sm hover:text-purple-400 transition-colors">
                  Keamanan Informasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-purple-400 transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-purple-400 transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-xs text-gray-500">
            Dikembangkan dengan ❤️ untuk pelayanan kesehatan anak Indonesia yang lebih baik
          </p>
        </div>
      </div>
    </footer>
  );
}