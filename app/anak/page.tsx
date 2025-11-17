import { Suspense } from 'react';
import { supabase } from "@/lib/supabase";
import SearchBar from "@/components/SearchBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, Users } from "lucide-react";

interface AnakPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function AnakList({ searchParams }: AnakPageProps) {
  const params = await searchParams;
  const raw = params["search"];
  const keyword = typeof raw === "string" ? raw : "";

  const { data: anak, error } = await supabase
    .from("anak")
    .select("id, nik_anak, nama_anak")
    .ilike("nama_anak", `%${keyword}%`)
    .order("nama_anak", { ascending: true });

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <p className="text-red-500">Error: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {anak && anak.length > 0 ? (
        anak.map((a) => (
          <Card 
            key={a.id} 
            className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-l-4 border-l-purple-500"
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center flex-shrink-0">
                  <Baby className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {a.nama_anak}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    NIK: {a.nik_anak}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Baby className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {keyword ? `Tidak ada hasil untuk "${keyword}"` : "Belum ada data anak"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default async function AnakPage({ searchParams }: AnakPageProps) {
  // Get total count
  const { count } = await supabase
    .from("anak")
    .select("*", { count: "exact", head: true });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Anak</h1>
        <p className="text-gray-600 mt-1">
          Kelola dan lihat data anak posyandu
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Anak
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{count || 0}</div>
            <p className="text-xs text-gray-600 mt-1">Terdaftar di sistem</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<div className="animate-pulse h-12 bg-gray-200 rounded" />}>
            <SearchBar />
          </Suspense>
        </CardContent>
      </Card>

      {/* Data List */}
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <AnakList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}