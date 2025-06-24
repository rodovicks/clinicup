'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UploadProps {
  initialImage?: string;
  onImageUpload?: (file: File, preview: string) => void;
}

export default function Upload({ initialImage, onImageUpload }: UploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  //TODO Colocar um useEffect para pegar a imagem e salvar no useState preview

  const [preview, setPreview] = useState<string | null>(initialImage || null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onImageUpload?.(file, URL.createObjectURL(file));
    }
  }

  return (
    <div className="space-y-4">
      <Avatar className="w-24 h-24 mx-auto">
        <AvatarImage src={preview || ''} />
        <AvatarFallback>IMG</AvatarFallback>
      </Avatar>

      <Input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        name="photo"
        id="photo"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button
        variant={'primary'}
        type="button"
        onClick={() => document.getElementById('photo')?.click()}
        className="w-full"
      >
        Selecionar Foto
      </Button>
    </div>
  );
}
