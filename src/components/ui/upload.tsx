'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import axios from 'axios';
import { User2Icon } from 'lucide-react';

interface UploadProps {
  initialImage?: string;
  onImageUpload?: (file: File, preview: string) => void;
}

function Upload({ initialImage, onImageUpload }: UploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [blob, setBlob] = useState<Blob | null>(null);

  const [preview, setPreview] = useState<string | null>(initialImage || null);

  useEffect(() => {
    if (!initialImage) {
      setBlob(null);
      return;
    }

    axios
      .get('/api/users/photo', {
        params: { initialImage },
        responseType: 'blob',
      })
      .then((response) => {
        setBlob(response.data);
      })
      .catch(() => {
        setBlob(null);
      });
  }, [initialImage]);

  const imgPreview = useMemo(() => {
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    setPreview(url);
    return url;
  }, [blob]);

  useEffect(() => {
    return () => {
      if (imgPreview) {
        URL.revokeObjectURL(imgPreview);
      }
    };
  }, []);

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
        <AvatarFallback>
          <User2Icon />
        </AvatarFallback>
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

export default React.memo(Upload);
