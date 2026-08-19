'use client';

import { Upload, FileText, X } from 'lucide-react';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { useUser } from '@clerk/nextjs';

import { Button } from './ui/button';
import { supabase } from '@/lib/supabase_bucket';

const FileUpload = () => {
  const { user } = useUser();

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    setError(null);

    try {
      // Upload to Supabase Storage
      const filePath =
        user.id +
        '/' +
        Date.now().toString() +
        '-' +
        file.name.replace(' ', '-');
      const { data, error: uploadError } = await supabase.storage
        .from('chat_pdf')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('chat_pdf').getPublicUrl(filePath);
      console.log('Public URL:', publicUrl);

      setFile(null);

      // TODO: Upload to backend
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='w-full space-y-4'>
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
            isDragActive
              ? 'border-rose-400 bg-rose-50 scale-105'
              : 'border-rose-200 bg-white hover:bg-rose-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center gap-2'>
            <Upload
              className={`h-6 w-6 ${isDragActive ? 'text-rose-600' : 'text-teal-600'}`}
            />
            <p className='text-sm font-medium text-slate-900'>
              {isDragActive ? 'Drop your PDF' : 'Drag PDF here or click'}
            </p>
          </div>
        </div>
      ) : (
        <div className='flex items-center gap-3 p-4 bg-linear-to-r from-rose-50 to-teal-50 rounded-lg border border-rose-100'>
          <FileText className='h-5 w-5 text-rose-600 shrink-0' />
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-slate-900 truncate'>
              {file.name}
            </p>
            <p className='text-xs text-slate-500'>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={() => setFile(null)}
            disabled={isUploading}
            className='p-1 hover:bg-rose-200 rounded transition-colors'
          >
            <X className='h-4 w-4 text-slate-600' />
          </button>
        </div>
      )}

      {error && <p className='text-sm text-red-600'>{error}</p>}

      {file && (
        <Button
          onClick={handleUpload}
          disabled={isUploading}
          className='w-full bg-linear-to-r from-rose-500 to-teal-500 hover:from-rose-600 hover:to-teal-600 text-white'
        >
          {isUploading ? 'Uploading...' : 'Upload PDF'}
        </Button>
      )}
    </div>
  );
};

export default FileUpload;
