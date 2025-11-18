'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Filter, Calendar, MapPin } from 'lucide-react';

interface Posyandu {
  id: string;
  nama_posyandu: string;
}

interface PosyanduData {
  id: string;
  nama_posyandu: string;
}

interface AnakData {
  id: string;
  nik_anak: string;
  nama_anak: string;
  jenis_kelamin: string;
  tanggal_lahir: string;
  nama_ortu: string;
  posyandu: PosyanduData;
}

interface PerkembanganData {
  id: string;
  tanggal: string;
  berat: number;
  tinggi: number;
  lila: number;
  cara_ukur: string;
  vitamin: string;
  keterangan: string;
  anak: AnakData;
}

export default function DownloadPosyanduPage() {
  const [posyanduList, setPosyanduList] = useState<Posyandu[]>([]);
  const [selectedPosyandu, setSelectedPosyandu] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Generate tahun dari 2020 sampai tahun sekarang
  const years = Array.from({ length: new Date().getFullYear() - 2019 }, (_, i) => 2020 + i);
  
  const months = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ];

  // Fetch posyandu list
  useEffect(() => {
    fetchPosyandu();
  }, []);

  const fetchPosyandu = async () => {
    try {
      const response = await fetch('/api/supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'select',
          table: 'posyandu',
          select: 'id, nama_posyandu',
          order: { column: 'nama_posyandu', ascending: true }
        })
      });
      const result = await response.json();
      if (result.data) {
        setPosyanduList(result.data);
      }
    } catch (err) {
      console.error('Error fetching posyandu:', err);
    }
  };

  const fetchDataAndDownload = async () => {
    if (!selectedMonth) {
      setError('Silakan pilih bulan terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Build filter - Fetch ALL data from 'perkembangan' table
      const query = {
        action: 'select',
        table: 'perkembangan',
        select: `
          *,
          anak:anak_id (
            id,
            nik_anak,
            nama_anak,
            jenis_kelamin,
            tanggal_lahir,
            nama_ortu,
            posyandu:posyandu_id (
              id,
              nama_posyandu
            )
          )
        `,
        order: { column: 'tanggal', ascending: true }
      };

      console.log('🚀 Starting download process...');
      console.log('Filtering for: Year:', selectedYear, 'Month:', selectedMonth, 'Posyandu ID:', selectedPosyandu);

      const response = await fetch('/api/supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
      });

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error.message || 'Terjadi kesalahan saat mengambil data');
      }

      let data: PerkembanganData[] = result.data || [];

      console.log(`✅ Total data fetched from server: ${data.length}`);

      // --- DEBUG: Print first few items to see the actual date format ---
      if (data.length > 0) {
        console.log('📌 First 3 items for debugging:');
        data.slice(0, 3).forEach((item, index) => {
          console.log(`  Item ${index + 1}:`, {
            id: item.id,
            tanggal: item.tanggal,
            dateStringForFilter: item.tanggal.split('T')[0].substring(0, 7),
            anakId: item.anak?.id,
            posyanduId: item.anak?.posyandu?.id,
            posyanduName: item.anak?.posyandu?.nama_posyandu
          });
        });
      }

      // Filter by selected month and year using substring matching
      const selectedDate = `${selectedYear}-${selectedMonth}`;
      console.log(`🔍 Filtering for month/year: "${selectedDate}"`);

      data = data.filter(item => {
        // Ambil YYYY-MM dari tanggal (misal: "2025-11-19" → "2025-11")
        const itemDate = item.tanggal.split('T')[0].substring(0, 7);
        const matches = itemDate === selectedDate;
        // For debugging: uncomment next line to see what's being matched
        // console.log(`  Checking ${item.tanggal} -> ${itemDate} === ${selectedDate} ? ${matches}`);
        return matches;
      });

      console.log(`✅ Data after month/year filter: ${data.length}`);

      // Filter by posyandu jika dipilih
      if (selectedPosyandu !== 'all') {
        data = data.filter(item => {
          const posyanduId = item.anak?.posyandu?.id;
          // Convert both to string to handle type mismatch
          const isMatch = String(posyanduId) === String(selectedPosyandu);
          console.log(`  Checking posyandu ID: ${posyanduId} (${typeof posyanduId}) vs ${selectedPosyandu} (${typeof selectedPosyandu}) -> ${isMatch}`);
          return isMatch;
        });
        console.log(`✅ Data after posyandu filter: ${data.length}`);
      }

      if (data.length === 0) {
        setError('Tidak ada data untuk filter yang dipilih. Silakan cek data di Supabase.');
        setLoading(false);
        return;
      }

      // Convert to CSV
      const csv = convertToCSV(data);

      // Generate filename with descriptive name
      let filename = `data-posyandu-${selectedMonth}-${selectedYear}.csv`;
      if (selectedPosyandu !== 'all') {
        const selectedPosyanduName = posyanduList.find(p => p.id === selectedPosyandu)?.nama_posyandu || 'unknown';
        // Replace spaces with underscores for filename safety
        const safePosyanduName = selectedPosyanduName.replace(/\s+/g, '_');
        filename = `data-posyandu-${safePosyanduName}-${selectedMonth}-${selectedYear}.csv`;
      }
      
      // Download
      downloadCSV(csv, filename);
      
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat mengunduh data';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const convertToCSV = (data: PerkembanganData[]) => {
    const headers = [
      'Tanggal Pemeriksaan',
      'Nama Posyandu',
      'NIK Anak',
      'Nama Anak',
      'Jenis Kelamin',
      'Tanggal Lahir',
      'Usia (Bulan)',
      'Nama Orang Tua',
      'Berat Badan (kg)',
      'Tinggi Badan (cm)',
      'LILA (cm)',
      'Cara Ukur',
      'Vitamin',
      'Keterangan'
    ];

    const rows = data.map(item => {
      const tanggalPemeriksaan = new Date(item.tanggal).toLocaleDateString('id-ID');
      const tanggalLahir = item.anak?.tanggal_lahir 
        ? new Date(item.anak.tanggal_lahir).toLocaleDateString('id-ID')
        : '-';
      
      // Hitung usia dalam bulan
      const usia = item.anak?.tanggal_lahir 
        ? calculateAgeInMonths(item.anak.tanggal_lahir)
        : '-';

      return [
        tanggalPemeriksaan,
        item.anak?.posyandu?.nama_posyandu || '-',
        item.anak?.nik_anak || '-',
        item.anak?.nama_anak || '-',
        item.anak?.jenis_kelamin || '-',
        tanggalLahir,
        usia,
        item.anak?.nama_ortu || '-',
        item.berat || '-',
        item.tinggi || '-',
        item.lila || '-',
        item.cara_ukur || '-',
        item.vitamin || '-',
        item.keterangan || '-'
      ].map(cell => `"${cell}"`).join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  };

  const calculateAgeInMonths = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + 
                   today.getMonth() - birth.getMonth();
    return months;
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Download Data Posyandu</h1>
        <p className="text-gray-600 mt-1">
          Unduh data perkembangan anak dalam format spreadsheet (CSV)
        </p>
      </div>

      {/* Filter Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Posyandu Filter */}
          <div>
            <label htmlFor="posyandu-select" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4" />
              Posyandu
            </label>
            <select
              id="posyandu-select"
              value={selectedPosyandu}
              onChange={(e) => setSelectedPosyandu(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Posyandu</option>
              {posyanduList.map((posyandu) => (
                <option key={posyandu.id} value={posyandu.id}>
                  {posyandu.nama_posyandu}
                </option>
              ))}
            </select>
          </div>

          {/* Month & Year Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="month-select" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4" />
                Bulan
              </label>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Bulan</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year-select" className="text-sm font-medium text-gray-700 mb-2 block">
                Tahun
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Download Button */}
          <button
            onClick={fetchDataAndDownload}
            disabled={loading || !selectedMonth}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Mengunduh...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Download Spreadsheet
              </>
            )}
          </button>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="text-2xl">ℹ️</div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Informasi</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>File akan diunduh dalam format CSV yang dapat dibuka dengan Excel atau Google Sheets</li>
                <li>Pilih bulan dan tahun untuk mendapatkan data periode tertentu</li>
                <li>Anda dapat memfilter berdasarkan posyandu tertentu atau memilih semua posyandu</li>
                <li>Data yang diunduh mencakup informasi lengkap pemeriksaan anak</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}