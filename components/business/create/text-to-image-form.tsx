'use client';

import { motion } from 'framer-motion';

interface PromptExample {
  text: string;
}

interface TextToImageFormProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  examples: PromptExample[];
  onExampleClick: (example: string) => void;
  isGenerating: boolean;
  title: string;
  placeholder: string;
  tips: string;
  examplesLabel: string;
}

export function TextToImageForm({
  prompt,
  onPromptChange,
  examples,
  onExampleClick,
  isGenerating,
  title,
  placeholder,
  tips,
  examplesLabel,
}: TextToImageFormProps) {
  return (
    <motion.div
      key="text-to-image"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {title}
        </label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={placeholder}
          disabled={isGenerating}
          className="w-full h-32 px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none transition-all disabled:opacity-50"
        />
        <p className="mt-2 text-xs text-muted-foreground">{tips}</p>
      </div>

      {examples.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">{examplesLabel}</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => onExampleClick(example.text)}
                disabled={isGenerating}
                className="px-2.5 sm:px-3 py-1.5 text-xs bg-purple-500/10 text-purple-300 rounded-lg hover:bg-purple-500/20 transition-colors border border-purple-500/20 disabled:opacity-50 whitespace-nowrap max-w-full truncate"
                title={example.text}
              >
                <span className="truncate block max-w-[120px] sm:max-w-[150px]">{example.text.slice(0, 15)}...</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
