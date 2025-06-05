'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UploadProps {
  methods: any;
}
export default function Upload({ methods }: UploadProps) {
  const { register } = methods;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
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
        {...register('photo')}
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
