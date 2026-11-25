'use client';

import React, { useEffect, useRef, useState } from 'react';
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { Image as ImageIcon, X, AlertCircle, Loader2 } from 'lucide-react';
import { getAuthHeaders } from '../utils/auth';

interface BlockNoteEditorProps {
  initialContent?: string;
  onChange: (markdown: string, html: string, text: string) => void;
}

interface PendingUpload {
  file: File;
  previewUrl: string;
  blockId?: string;
  resolve: (result: { props: { url: string; caption: string; name: string } } | string) => void;
  reject: (error: Error) => void;
}

// Helper to detect if image caption/alt is merely an uploaded filename
function isRawFileName(str: string): boolean {
  if (!str) return true;
  const s = str.trim();
  if (!s || s.toLowerCase() === 'post media' || s.toLowerCase() === 'image' || s.toLowerCase() === 'article illustration') return true;
  if (/\.(png|jpe?g|gif|webp|svg|bmp|avif|tiff|heic)$/i.test(s)) return true;
  if (/^(image|img|screenshot|screen|file|media|photo|pasted|blob|untitled)[_-\d\s.]*$/i.test(s)) return true;
  if (/^[a-f0-9\-_]{12,}$/i.test(s)) return true;
  return false;
}

export default function BlockNoteEditorComponent({
  initialContent,
  onChange,
}: BlockNoteEditorProps) {
  const [pendingUpload, setPendingUpload] = useState<PendingUpload | null>(null);
  const [captionInput, setCaptionInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Custom upload handler: intercepts image selection to allow giving an optional caption
  const uploadFile = (file: File, blockId?: string): Promise<{ props: { url: string; caption: string; name: string } } | string> => {
    return new Promise((resolve, reject) => {
      const previewUrl = URL.createObjectURL(file);
      setPendingUpload({
        file,
        previewUrl,
        blockId,
        resolve,
        reject,
      });
      setCaptionInput('');
      setUploadError(null);
    });
  };

  const handleConfirmUpload = async (withCaption: boolean) => {
    if (!pendingUpload) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', pendingUpload.file);

      const res = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to upload media to Cloudinary');
      }

      const data = await res.json();
      const finalCaption = withCaption ? captionInput.trim() : '';

      // Clean up object URL
      URL.revokeObjectURL(pendingUpload.previewUrl);

      // Return clean props without storing the raw filename
      pendingUpload.resolve({
        props: {
          url: data.url,
          caption: finalCaption,
          name: finalCaption,
        },
      });

      setPendingUpload(null);
      setCaptionInput('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    if (!pendingUpload) return;
    URL.revokeObjectURL(pendingUpload.previewUrl);
    pendingUpload.reject(new Error('User cancelled upload'));
    setPendingUpload(null);
    setCaptionInput('');
    setUploadError(null);
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
      // Clean any raw filenames out of markdown images: e.g. ![screenshot.png](url) -> ![](url)
      const cleanedMarkdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
        if (isRawFileName(alt)) {
          return `![](${url})`;
        }
        return match;
      });
      const html = await editor.blocksToHTMLLossy(editor.document);
      const plainText = cleanedMarkdown.replace(/[#*`_[\]()-]/g, ' ');
      onChange(cleanedMarkdown, html, plainText);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative">
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-2 sm:p-4 min-h-[460px] shadow-2xs focus-within:border-neutral-400 transition-colors">
        <BlockNoteView
          editor={editor}
          theme="light"
          onChange={handleChange}
        />
      </div>

      {/* Upload Caption Modal */}
      {pendingUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xl max-w-md w-full p-5 font-mono text-neutral-900 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
                  Upload Image
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCancelUpload}
                disabled={isUploading}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div className="my-4 rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-2.5 flex items-center justify-center">
              <img
                src={pendingUpload.previewUrl}
                alt="Upload preview"
                className="max-h-44 w-auto object-contain rounded-lg shadow-2xs"
              />
            </div>

            {/* Caption Input */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between text-[11px]">
                <label htmlFor="image-caption-input" className="font-medium text-neutral-700">
                  Caption / Description <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <span className="text-[10px] text-neutral-400">
                  {(pendingUpload.file.size / 1024).toFixed(0)} KB
                </span>
              </div>
              <input
                id="image-caption-input"
                type="text"
                autoFocus
                value={captionInput}
                onChange={(e) => setCaptionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleConfirmUpload(true);
                  } else if (e.key === 'Escape') {
                    handleCancelUpload();
                  }
                }}
                disabled={isUploading}
                placeholder="e.g. Distributed Lock Architecture (leave empty for none)"
                className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50/50 text-neutral-800 focus:outline-none focus:border-neutral-400 focus:bg-white transition"
              />
              <p className="text-[10.5px] text-neutral-400 leading-normal">
                File names are never shown. If you provide a caption, it will display neatly under the image.
              </p>
            </div>

            {uploadError && (
              <div className="mb-4 p-2.5 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={handleCancelUpload}
                disabled={isUploading}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition disabled:opacity-50"
              >
                Cancel
              </button>
              {captionInput.trim() ? (
                <button
                  type="button"
                  onClick={() => handleConfirmUpload(true)}
                  disabled={isUploading}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Add with Caption</span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleConfirmUpload(false)}
                  disabled={isUploading}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Upload Image</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
