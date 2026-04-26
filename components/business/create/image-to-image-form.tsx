'use client';

import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { UploadedFile } from '@/components/ui/file-upload';
import { FileUpload } from '@/components/ui/file-upload';

interface ImageToImageFormProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  uploadedImages: UploadedFile[];
  onImagesChange: (images: UploadedFile[]) => void;
  isGenerating: boolean;
  uploadTitle: string;
  uploadDesc: string;
  dragHint: string;
  tips: string;
  maxFilesLabel: string;
  fileFormatLabel: string;
  promptTitle: string;
  promptPlaceholder: string;
}

export function ImageToImageForm({
  prompt,
  onPromptChange,
  uploadedImages,
  onImagesChange,
  isGenerating,
  uploadTitle,
  uploadDesc,
  dragHint,
  tips,
  maxFilesLabel,
  fileFormatLabel,
  promptTitle,
  promptPlaceholder,
}: ImageToImageFormProps) {
  return (
    <motion.div
      key="image-to-image"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {uploadTitle}
        </label>
        <p className="text-sm text-muted-foreground mb-4">{uploadDesc}</p>

        <FileUpload
          files={uploadedImages}
          onFilesChange={onImagesChange}
          maxFiles={3}
          accept="image/*"
          uploadTitle={uploadTitle}
          uploadDesc={uploadDesc}
          dragHint={dragHint}
          disabled={isGenerating}
        />

        <div className="mt-4 flex items-start gap-2 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <Info className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-purple-300">{tips}</p>
            <p className="text-xs text-purple-300/70 mt-1">
              {maxFilesLabel} • {fileFormatLabel}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {promptTitle}
        </label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={promptPlaceholder}
          disabled={isGenerating}
          className="w-full h-24 px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none transition-all disabled:opacity-50"
        />
      </div>
    </motion.div>
  );
}
