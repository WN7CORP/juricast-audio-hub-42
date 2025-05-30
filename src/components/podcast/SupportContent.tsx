
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SupportContentProps {
  description: string;
}

const SupportContent: React.FC<SupportContentProps> = ({ description }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 p-3 bg-juricast-card hover:bg-juricast-card/80 rounded-lg border border-juricast-card/30 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FileText size={20} className="text-juricast-accent" />
        <span className="font-medium">Mostrar Conteúdo de Apoio</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 bg-juricast-background/30 rounded-lg border border-juricast-card/20">
              <h3 className="font-semibold mb-3 text-juricast-accent">Conteúdo de Apoio</h3>
              <div className="prose prose-sm max-w-none text-juricast-text prose-headings:text-juricast-text prose-strong:text-juricast-text prose-em:text-juricast-accent">
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportContent;
