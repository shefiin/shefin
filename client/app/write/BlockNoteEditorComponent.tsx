'use client';

import React, { useEffect, useRef } from 'react';
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

interface BlockNoteEditorProps {
  initialContent?: string;
  onChange: (markdown: string, html: string, text: string) => void;
}

export default function BlockNoteEditorComponent({
  initialContent,
  onChange,
}: BlockNoteEditorProps) {
  const editor = useCreateBlockNote();
  const loadedRef = useRef(false);

  // Load initial content once if editing an existing article
  useEffect(() => {
    async function loadContent() {
      if (editor && initialContent && !loadedRef.current) {
        loadedRef.current = true;
        try {
          const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
          if (blocks && blocks.length > 0) {
            editor.replaceBlocks(editor.document, blocks);
          }
        } catch {
          // If markdown parsing fails, try html or keep as is
          try {
            const htmlBlocks = await editor.tryParseHTMLToBlocks(initialContent);
            if (htmlBlocks && htmlBlocks.length > 0) {
              editor.replaceBlocks(editor.document, htmlBlocks);
            }
          } catch {
            // Keep default empty block
          }
        }
      }
    }
    loadContent();
  }, [editor, initialContent]);

  const handleChange = async () => {
    if (!editor) return;
    try {
      const markdown = await editor.blocksToMarkdownLossy(editor.document);
      const html = await editor.blocksToHTMLLossy(editor.document);
      const plainText = markdown.replace(/[#*`_[\]()-]/g, ' ');
      onChange(markdown, html, plainText);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-2 sm:p-4 min-h-[460px] shadow-2xs focus-within:border-neutral-400 transition-colors">
      <BlockNoteView
        editor={editor}
        theme="light"
        onChange={handleChange}
      />
    </div>
  );
}

