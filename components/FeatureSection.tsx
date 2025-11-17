import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { 
  GraduationCap, 
  Building2, 
  BarChart3, 
  BookOpen, 
  Megaphone, 
  MapPin 
} from 'lucide-react';

const features = [
  {
    title: 'Data Anak',
    description: 'Kelola data anak posyandu',
    icon: GraduationCap,
    href: '/anak',
    color: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Data Posyandu',
    description: 'Informasi posyandu wilayah',
    icon: Building2,
    href: '/posyandu',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    title: 'Statistik',
    description: 'Statistik dan laporan',
    icon: BarChart3,
    href: '/statistik',
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Perkembangan',
    description: 'Tracking perkembangan anak',
    icon: BookOpen,
    href: '/perkembangan',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Pengumuman',
    description: 'Info & pengumuman terbaru',
    icon: Megaphone,
    href: '/pengumuman',
    color: 'from-pink-500 to-purple-500',
  },
  {
    title: 'Peta',
    description: 'Peta lokasi posyandu',
    icon: MapPin,
    href: '/peta',
    color: 'from-emerald-500 to-teal-500',
  },
];

export default function FeatureSection() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fitur Utama Sistem
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Akses berbagai layanan dan informasi data posyandu secara mudah dan cepat
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} href={feature.href}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
              150+
            </div>
            <div className="text-sm text-gray-600">
              Anak Terdaftar
            </div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
              25+
            </div>
            <div className="text-sm text-gray-600">
              Posyandu Aktif
            </div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
              500+
            </div>
            <div className="text-sm text-gray-600">
              Data Perkembangan
            </div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
              100%
            </div>
            <div className="text-sm text-gray-600">
              Data Terintegrasi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}