'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('search') || '');
  const [searchType, setSearchType] = useState(searchParams.get('type') || 'nama');
  const [isPending, startTransition] = useTransition();

  const onSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (keyword.trim()) {
      params.set('search', keyword.trim());
      params.set('type', searchType);
    } else {
      params.delete('search');
      params.delete('type');
    }
    
    startTransition(() => {
      router.push(`/anak?${params.toString()}`);
    });
  };

  const onClear = () => {
    setKeyword('');
    setSearchType('nama');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('type');
    startTransition(() => {
      router.push(`/anak?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={onSearch} className="flex flex-col gap-3 w-full max-w-xl mx-auto">
      <Select value={searchType} onValueChange={setSearchType} disabled={isPending}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih tipe pencarian" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nama">Nama Anak</SelectItem>
          <SelectItem value="nik">NIK</SelectItem>
          <SelectItem value="posyandu">Posyandu</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Input
          placeholder={
            searchType === 'nama' ? "Cari nama anak..." :
            searchType === 'nik' ? "Cari NIK..." :
            "Cari posyandu..."
          }
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending}>
          <Search className="h-4 w-4" />
        </Button>
        {keyword && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClear}
            disabled={isPending}
          >
            Clear
          </Button>
        )}
      </div>
    </form>
  );
}