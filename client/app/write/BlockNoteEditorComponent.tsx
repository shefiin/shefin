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
  // Custom upload handler for images, animated GIFs, and videos
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:5001/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload media to server');
    }

    const data = await res.json();
    return data.url;
  };

  const editor = useCreateBlockNote({
    uploadFile,
  });

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
