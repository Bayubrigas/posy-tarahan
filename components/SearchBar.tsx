'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const onSearch = () => {
    if (!keyword.trim()) return;
    router.push(`/anak?search=${keyword}`);
  };

  return (
    <div className="flex gap-2 w-full max-w-xl mx-auto mt-6">
      <Input
        placeholder="Cari nama anak..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Button onClick={onSearch}>
        <Search />
      </Button>
    </div>
  );
}
