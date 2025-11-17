'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('search') || '');
  const [isPending, startTransition] = useTransition();

  const onSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (keyword.trim()) {
      params.set('search', keyword.trim());
    } else {
      params.delete('search');
    }
    
    startTransition(() => {
      router.push(`/anak?${params.toString()}`);
    });
  };

  const onClear = () => {
    setKeyword('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    startTransition(() => {
      router.push(`/anak?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={onSearch} className="flex gap-2 w-full max-w-xl mx-auto mt-6">
      <Input
        placeholder="Cari nama anak..."
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
    </form>
  );
}