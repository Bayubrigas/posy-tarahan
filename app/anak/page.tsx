import { supabase } from "@/lib/supabase";
import SearchBar from "@/components/SearchBar";

interface AnakPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function AnakPage({ searchParams }: AnakPageProps) {
  const raw = searchParams["search"];
  const keyword = typeof raw === "string" ? raw : "";

  const { data: anak } = await supabase
    .from("anak")
    .select("*")
    .ilike("nama_anak", `%${keyword}%`);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Daftar Anak</h1>

      <SearchBar />

      <div className="mt-6 space-y-4">
        {anak?.map((a) => (
          <div
            key={a.nik_anak}
            className="p-4 bg-white shadow rounded-lg"
          >
            <p className="font-semibold">{a.nama_anak}</p>
            <p className="text-sm text-gray-600">{a.nik}</p>
          </div>
        ))}

        {anak?.length === 0 && (
          <p className="text-gray-500">Tidak ada hasil.</p>
        )}
      </div>
    </div>
  );
}
