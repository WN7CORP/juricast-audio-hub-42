
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpandableDescriptionProps {
  description: string;
  title?: string;
  maxLines?: number;
  className?: string;
}

const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({
  description,
  title = "Mostrar Conteúdo",
  maxLines = 3,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description || description.trim() === '') {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full p-3 bg-juricast-card/50 hover:bg-juricast-card/70 rounded-lg transition-all mb-2 text-left"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="p-1.5 bg-juricast-accent/20 rounded-md">
          <FileText size={16} className="text-juricast-accent" />
        </div>
        <span className="font-medium text-sm flex-1">{title}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-juricast-muted" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-juricast-background/50 rounded-lg p-4 border border-juricast-card/30">
              <p className="text-sm leading-relaxed text-juricast-text/90">
                {description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpandableDescription;
