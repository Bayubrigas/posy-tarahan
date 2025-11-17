import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Baby, UserCircle, TrendingUp } from "lucide-react";

async function getDashboardStats() {
  // Total Anak
  const { count: totalAnak } = await supabase
    .from("anak")
    .select("*", { count: "exact", head: true });

  // Total Posyandu (jika ada table posyandu)
  const { count: totalPosyandu } = await supabase
    .from("posyandu")
    .select("*", { count: "exact", head: true });

  // Total Perkembangan Records
  const { count: totalPerkembangan } = await supabase
    .from("perkembangan")
    .select("*", { count: "exact", head: true });

  // Data Anak Terbaru
  const { data: anakTerbaru } = await supabase
    .from("anak")
    .select("id, nama_anak, nik_anak")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    totalAnak: totalAnak || 0,
    totalPosyandu: totalPosyandu || 0,
    totalPerkembangan: totalPerkembangan || 0,
    anakTerbaru: anakTerbaru || [],
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Selamat datang di Sistem Posyandu
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Anak
            </CardTitle>
            <Baby className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnak}</div>
            <p className="text-xs text-gray-600 mt-1">
              Terdaftar di sistem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Posyandu
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosyandu}</div>
            <p className="text-xs text-gray-600 mt-1">
              Posyandu aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Data Perkembangan
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPerkembangan}</div>
            <p className="text-xs text-gray-600 mt-1">
              Total record
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pertumbuhan
            </CardTitle>
            <UserCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-gray-600 mt-1">
              Dari bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anak Terbaru */}
        <Card>
          <CardHeader>
            <CardTitle>Anak Terdaftar Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.anakTerbaru.length > 0 ? (
                stats.anakTerbaru.map((anak) => (
                  <div
                    key={anak.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Baby className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {anak.nama_anak}
                        </p>
                        <p className="text-sm text-gray-600">
                          {anak.nik_anak}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Belum ada data
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/anak"
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Baby className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">
                    Lihat Semua Anak
                  </span>
                </div>
                <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>

              <a
                href="/posyandu"
                className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">
                    Kelola Posyandu
                  </span>
                </div>
                <span className="text-green-600 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>

              <a
                href="/perkembangan"
                className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">
                    Input Perkembangan
                  </span>
                </div>
                <span className="text-purple-600 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}