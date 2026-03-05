import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, File, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from './button';
import { Progress } from './progress';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  label?: string;
  description?: string;
}

export function FileUpload({
  onFileSelect,
  accept = '*',
  multiple = false,
  maxSize = 10,
  label = 'Upload files',
  description = 'Drag and drop or click to browse'
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      return sizeMB <= maxSize;
    });

    if (validFiles.length > 0) {
      setIsUploading(true);
      setSelectedFiles(validFiles);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            onFileSelect(validFiles);
          }, 300);
        }
      }, 100);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return ImageIcon;
    if (file.type.includes('pdf') || file.type.includes('document')) return FileText;
    return File;
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-[#353CED] bg-[#353CED]/5 scale-105' 
            : 'border-gray-300 hover:border-[#353CED] hover:bg-gray-50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center shadow-lg">
            <Upload className="w-8 h-8 text-[#CDFF2A]" />
          </div>
          <div>
            <p className="text-[#1F2937] mb-1">{label}</p>
            <p className="text-sm text-[#6B7280]">{description}</p>
            <p className="text-xs text-[#9CA3AF] mt-2">Max file size: {maxSize}MB</p>
          </div>
        </div>

        {isUploading && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-[#6B7280] mt-2">Uploading... {uploadProgress}%</p>
          </div>
        )}
      </div>

      {/* Selected Files */}
      <AnimatePresence>
        {selectedFiles.length > 0 && !isUploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {selectedFiles.map((file, index) => {
              const FileIcon = getFileIcon(file);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center">
                    <FileIcon className="w-5 h-5 text-[#CDFF2A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1F2937] truncate">{file.name}</p>
                    <p className="text-xs text-[#6B7280]">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
