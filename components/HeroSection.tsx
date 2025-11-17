'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [searchType, setSearchType] = useState('semua');
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/anak?search=${keyword.trim()}`);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Sistem Informasi Data Posyandu
            </h1>
            <p className="text-lg md:text-xl text-purple-100">
              Kelola data kesehatan anak dan perkembangan posyandu dengan mudah dan terintegrasi
            </p>
            <Button
              onClick={() => router.push('/dashboard')}
              size="lg"
              className="bg-white text-purple-700 hover:bg-purple-50 font-semibold px-8 py-6 text-lg"
            >
              Buka Dashboard
            </Button>
          </div>

          {/* Right Content - Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Cari Data Anak
            </h2>

            <form onSubmit={handleSearch} className="space-y-4">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Pilih tipe pencarian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua</SelectItem>
                  <SelectItem value="nama">Nama Anak</SelectItem>
                  <SelectItem value="nik">NIK</SelectItem>
                  <SelectItem value="posyandu">Posyandu</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Input
                  type="text"
                  placeholder="Kata kunci: [Nama] [NIK] [Posyandu]"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full h-12 pr-12 text-base"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 h-10 w-10 bg-purple-600 hover:bg-purple-700"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium hover:underline"
                  onClick={() => router.push('/pencarian-spesifik')}
                >
                  Pencarian Spesifik
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Data yang ditampilkan adalah data resmi dari sistem Posyandu
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}