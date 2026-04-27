'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadedFile {
  id: string;
  url: string;
  name: string;
  file?: File;
}

interface FileUploadProps {
  /** 已上传的文件列表 */
  files: UploadedFile[];
  /** 文件列表变更回调 */
  onFilesChange: (files: UploadedFile[]) => void;
  /** 最大文件数量 */
  maxFiles?: number;
  /** 接受的文件类型 */
  accept?: string;
  /** 上传区域标题 */
  uploadTitle?: string;
  /** 上传区域描述 */
  uploadDesc?: string;
  /** 拖拽提示文字 */
  dragHint?: string;
  /** 是否允许多选 */
  multiple?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 上传区域类名 */
  uploadAreaClassName?: string;
  /** 预览区域类名 */
  previewClassName?: string;
}

export function FileUpload({
  files,
  onFilesChange,
  maxFiles = 3,
  accept = 'image/*',
  uploadTitle = '上传图片',
  uploadDesc = '支持拖拽或点击上传',
  dragHint = '点击或拖拽上传',
  multiple = true,
  disabled = false,
  className,
  uploadAreaClassName,
  previewClassName,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (disabled || !fileList) return;

      const remainingSlots = maxFiles - files.length;
      if (remainingSlots <= 0) return;

      const newFiles: UploadedFile[] = [];
      const filesToProcess = Array.from(fileList).slice(0, remainingSlots);

      filesToProcess.forEach((file) => {
        // 检查文件类型
        if (accept !== '*/*' && !file.type.match(accept.replace('/*', '/'))) {
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const uploadedFile: UploadedFile = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: event.target?.result as string,
            name: file.name,
            file,
          };
          newFiles.push(uploadedFile);

          // 当所有文件都处理完成后，更新状态
          if (newFiles.length === filesToProcess.length) {
            onFilesChange([...files, ...newFiles]);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [files, maxFiles, accept, onFilesChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, [disabled]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles, disabled]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // 重置 input 值，允许重复选择相同文件
      e.target.value = '';
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (id: string) => {
      onFilesChange(files.filter((f) => f.id !== id));
    },
    [files, onFilesChange]
  );

  const canUploadMore = files.length < maxFiles;

  return (
    <div className={cn('space-y-4', className)}>
      {/* 文件预览区域 */}
      {files.length > 0 && (
        <div className={cn('flex flex-wrap gap-4', previewClassName)}>
          {files.map((file) => (
            <div
              key={file.id}
              className="relative group w-32 h-32 rounded-xl overflow-hidden border border-border/50"
            >
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => removeFile(file.id)}
                  disabled={disabled}
                  className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
              {/* 文件名提示 */}
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-white truncate">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 拖拽上传区域 */}
      {canUploadMore && !disabled && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative rounded-xl border-2 border-dashed transition-all duration-200',
            'flex flex-col items-center justify-center cursor-pointer',
            'hover:border-purple-500/50 hover:bg-purple-500/5',
            isDragging
              ? 'border-purple-500 bg-purple-500/10 scale-[1.02]'
              : 'border-border/50 bg-transparent',
            uploadAreaClassName
          )}
        >
          <input
            type="file"
            accept={accept}
            multiple={multiple && maxFiles - files.length > 1}
            onChange={handleInputChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="pointer-events-none flex flex-col items-center justify-center p-6">
            <Upload
              className={cn(
                'w-6 h-6 mb-2 transition-colors',
                isDragging ? 'text-purple-400' : 'text-muted-foreground'
              )}
            />
            <p
              className={cn(
                'text-sm font-medium transition-colors',
                isDragging ? 'text-purple-400' : 'text-foreground'
              )}
            >
              {isDragging ? '松开以上传' : dragHint}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {uploadDesc}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              还可上传 {maxFiles - files.length} 个文件
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
