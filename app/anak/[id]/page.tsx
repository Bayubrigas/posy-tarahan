import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, Calendar, MapPin, TrendingUp, Weight, Ruler, Activity } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getAnakDetail(id: string) {
  console.log(`[DEBUG] Fetching anak with id: ${id}`);
  
  const { data: anak, error: anakError } = await supabase
    .from("anak")
    .select(`
      *,
      posyandu_id (
        nama_posyandu
      )
    `)
    .eq("id", id)
    .single();

  if (anakError) {
    console.error(`[ERROR] Failed to fetch anak:`, anakError.message);
    return null;
  }

  if (!anak) {
    console.warn(`[WARN] No anak found with id: ${id}`);
    return null;
  }

  console.log(`[DEBUG] Successfully fetched anak:`, anak.nama_anak);

  const { data: perkembangan, error: perkembanganError } = await supabase
    .from("perkembangan")
    .select("*")
    .eq("anak_id", id)
    .order("tanggal_pengukuran", { ascending: true });

  if (perkembanganError) {
    console.error(`[ERROR] Failed to fetch perkembangan:`, perkembanganError.message);
  }

  return {
    anak,
    perkembangan: perkembangan || [],
  };
}

function calculateAge(birthDate: string) {
  const birth = new Date(birthDate);
  const today = new Date();
  const months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years > 0) {
    return `${years} tahun ${remainingMonths} bulan`;
  }
  return `${remainingMonths} bulan`;
}

function getStatusGizi(beratBadan: number, tinggiBadan: number) {
  const tinggiMeter = tinggiBadan / 100;
  const bmi = beratBadan / (tinggiMeter * tinggiMeter);
  
  if (bmi < 17) return { status: "Gizi Kurang", color: "text-orange-600 bg-orange-50" };
  if (bmi < 18.5) return { status: "Gizi Baik", color: "text-green-600 bg-green-50" };
  if (bmi < 25) return { status: "Gizi Baik", color: "text-green-600 bg-green-50" };
  if (bmi < 30) return { status: "Gizi Lebih", color: "text-yellow-600 bg-yellow-50" };
  return { status: "Obesitas", color: "text-red-600 bg-red-50" };
}

// Chart data type
interface ChartData {
  tanggal: string;
  beratBadan: number;
  tinggiBadan: number;
  lingkarKepala: number;
}

// Simple SVG Line Chart Component
function SimpleLineChart({ 
  data, 
  dataKey, 
  color, 
  label,
  unit 
}: { 
  data: ChartData[]; 
  dataKey: keyof Omit<ChartData, 'tanggal'>; 
  color: string;
  label: string;
  unit: string;
}) {
  if (data.length === 0) return null;

  const values = data.map(d => d[dataKey]);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;
  
  const width = 100;
  const height = 60;
  const padding = 5;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((d[dataKey] - minValue) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" strokeWidth="0.5" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" strokeWidth="0.5" />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1 || 1)) * (width - padding * 2) + padding;
          const y = height - padding - ((d[dataKey] - minValue) / range) * (height - padding * 2);
          return (
            <circle key={i} cx={x} cy={y} r="2" fill={color} />
          );
        })}
      </svg>
      
      {/* Labels */}
      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
        <div className="text-left">
          {data[0] && `${data[0][dataKey]} ${unit}`}
        </div>
        <div className="text-center">
          {label}
        </div>
        <div className="text-right">
          {data[data.length - 1] && `${data[data.length - 1][dataKey]} ${unit}`}
        </div>
      </div>
    </div>
  );
}

export default async function DetailAnakPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getAnakDetail(id);

  if (!data) {
    notFound();
  }

  const { anak, perkembangan } = data;
  
  const age = calculateAge(anak.tanggal_lahir);
  
  const chartData = perkembangan.map((item) => ({
    tanggal: new Date(item.tanggal_pengukuran).toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short'
    }),
    beratBadan: item.berat_badan,
    tinggiBadan: item.tinggi_badan,
    lingkarKepala: item.lingkar_kepala,
  }));

  const latestMeasurement = perkembangan[perkembangan.length - 1];
  const statusGizi = latestMeasurement 
    ? getStatusGizi(latestMeasurement.berat_badan, latestMeasurement.tinggi_badan)
    : null;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div>
          <Link 
            href="/anak" 
            className="text-sm text-purple-600 hover:text-purple-800 mb-2 inline-block"
          >
            ← Kembali ke Daftar Anak
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{anak.nama_anak}</h1>
          <p className="text-gray-600 mt-1">NIK: {anak.nik_anak}</p>
        </div>
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-600 to-purple-800 flex items-center justify-center">
          <Baby className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Usia</p>
                <p className="text-xl font-bold text-gray-900">{age}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Posyandu</p>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {anak.posyandu?.nama_posyandu || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Pemeriksaan</p>
                <p className="text-xl font-bold text-gray-900">{perkembangan.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${statusGizi ? 'border-l-orange-500' : 'border-l-gray-300'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className={`h-8 w-8 ${statusGizi ? 'text-orange-600' : 'text-gray-400'}`} />
              <div>
                <p className="text-sm text-gray-600">Status Gizi</p>
                {statusGizi ? (
                  <p className={`text-sm font-bold px-2 py-1 rounded ${statusGizi.color}`}>
                    {statusGizi.status}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">Belum ada data</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {perkembangan.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weight Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Weight className="h-5 w-5 text-blue-600" />
                Grafik Berat Badan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleLineChart 
                data={chartData}
                dataKey="beratBadan"
                color="#3b82f6"
                label="Berat Badan"
                unit="kg"
              />
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600">Data Terkini</p>
                <p className="text-2xl font-bold text-blue-600">
                  {latestMeasurement?.berat_badan} kg
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {perkembangan.length > 1 && (
                    <>
                      {latestMeasurement.berat_badan > perkembangan[perkembangan.length - 2].berat_badan ? '↑' : '↓'}
                      {' '}
                      {Math.abs(latestMeasurement.berat_badan - perkembangan[perkembangan.length - 2].berat_badan).toFixed(1)} kg
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Height Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Ruler className="h-5 w-5 text-green-600" />
                Grafik Tinggi Badan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleLineChart 
                data={chartData}
                dataKey="tinggiBadan"
                color="#10b981"
                label="Tinggi Badan"
                unit="cm"
              />
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-600">Data Terkini</p>
                <p className="text-2xl font-bold text-green-600">
                  {latestMeasurement?.tinggi_badan} cm
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {perkembangan.length > 1 && (
                    <>
                      {latestMeasurement.tinggi_badan > perkembangan[perkembangan.length - 2].tinggi_badan ? '↑' : '↓'}
                      {' '}
                      {Math.abs(latestMeasurement.tinggi_badan - perkembangan[perkembangan.length - 2].tinggi_badan).toFixed(1)} cm
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Head Circumference Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5 text-purple-600" />
                Grafik Lingkar Kepala
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleLineChart 
                data={chartData}
                dataKey="lingkarKepala"
                color="#8b5cf6"
                label="Lingkar Kepala"
                unit="cm"
              />
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-gray-600">Data Terkini</p>
                <p className="text-2xl font-bold text-purple-600">
                  {latestMeasurement?.lingkar_kepala} cm
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {perkembangan.length > 1 && (
                    <>
                      {latestMeasurement.lingkar_kepala > perkembangan[perkembangan.length - 2].lingkar_kepala ? '↑' : '↓'}
                      {' '}
                      {Math.abs(latestMeasurement.lingkar_kepala - perkembangan[perkembangan.length - 2].lingkar_kepala).toFixed(1)} cm
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Belum ada data perkembangan</p>
              <p className="text-gray-400 text-sm mt-2">
                Data perkembangan akan muncul setelah dilakukan pemeriksaan
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Table */}
      {perkembangan.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Pemeriksaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Berat (kg)</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tinggi (cm)</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Lingkar Kepala (cm)</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {perkembangan.slice().reverse().map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {new Date(item.tanggal_pengukuran).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-4 font-medium">{item.berat_badan}</td>
                      <td className="py-3 px-4 font-medium">{item.tinggi_badan}</td>
                      <td className="py-3 px-4 font-medium">{item.lingkar_kepala}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {item.catatan || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Lengkap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Nama Lengkap</p>
              <p className="font-semibold text-gray-900">{anak.nama_anak}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">NIK</p>
              <p className="font-semibold text-gray-900">{anak.nik_anak}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tanggal Lahir</p>
              <p className="font-semibold text-gray-900">
                {new Date(anak.tanggal_lahir).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Jenis Kelamin</p>
              <p className="font-semibold text-gray-900">
                {anak.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Nama Orang Tua</p>
              <p className="font-semibold text-gray-900">{anak.nama_orang_tua}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Posyandu</p>
              <p className="font-semibold text-gray-900">
                {anak.posyandu?.nama_posyandu || 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}