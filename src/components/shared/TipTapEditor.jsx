import React, { useState, useRef, useEffect } from 'react';
import { createLowlight, common } from 'lowlight';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { EditorContent, useEditor } from '@tiptap/react';
import toast from 'react-hot-toast';

// <-- TAMBAHAN: Import Ikon & Supabase -->
import { ImagePlus } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

// --- 1. Ekstensi Dasar Tiptap Asli ---
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { Placeholder } from '@tiptap/extension-placeholder';
import { HardBreak } from '@tiptap/extension-hard-break';
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list-item';

// --- 2. Import Semua Ekstensi dari reactjs-tiptap-editor ---
import { History, RichTextUndo, RichTextRedo } from 'reactjs-tiptap-editor/history';
import { SearchAndReplace, RichTextSearchAndReplace } from 'reactjs-tiptap-editor/searchandreplace';
import { Clear, RichTextClear } from 'reactjs-tiptap-editor/clear';
import { FontFamily, RichTextFontFamily } from 'reactjs-tiptap-editor/fontfamily';
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading';
import { FontSize, RichTextFontSize } from 'reactjs-tiptap-editor/fontsize';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic';
import { TextUnderline, RichTextUnderline } from 'reactjs-tiptap-editor/textunderline';
import { Strike, RichTextStrike } from 'reactjs-tiptap-editor/strike';
import { MoreMark, RichTextMoreMark } from 'reactjs-tiptap-editor/moremark';
import { Color, RichTextColor } from 'reactjs-tiptap-editor/color';
import { Highlight, RichTextHighlight } from 'reactjs-tiptap-editor/highlight';
import { BulletList, RichTextBulletList } from 'reactjs-tiptap-editor/bulletlist';
import { OrderedList, RichTextOrderedList } from 'reactjs-tiptap-editor/orderedlist';
import { TaskList, RichTextTaskList } from 'reactjs-tiptap-editor/tasklist';
import { TextAlign, RichTextAlign } from 'reactjs-tiptap-editor/textalign';
import { Indent, RichTextIndent } from 'reactjs-tiptap-editor/indent';
import { LineHeight, RichTextLineHeight } from 'reactjs-tiptap-editor/lineheight';
import { TextDirection, RichTextTextDirection } from 'reactjs-tiptap-editor/textdirection';
import { Link, RichTextLink } from 'reactjs-tiptap-editor/link';
// HANYA IMPORT IMAGE EXTENSION (RICH TEXT IMAGE KITA HAPUS KARENA DIGANTI CUSTOM)
import { Image } from 'reactjs-tiptap-editor/image';
import { Video, RichTextVideo } from 'reactjs-tiptap-editor/video';
import { ImageGif, RichTextImageGif } from 'reactjs-tiptap-editor/imagegif';
import { Attachment, RichTextAttachment } from 'reactjs-tiptap-editor/attachment';
import { Blockquote, RichTextBlockquote } from 'reactjs-tiptap-editor/blockquote';
import { HorizontalRule, RichTextHorizontalRule } from 'reactjs-tiptap-editor/horizontalrule';
import { Code, RichTextCode } from 'reactjs-tiptap-editor/code';
import { CodeBlock, RichTextCodeBlock } from 'reactjs-tiptap-editor/codeblock';
import { CodeView, RichTextCodeView } from 'reactjs-tiptap-editor/codeview';
import { Callout, RichTextCallout } from 'reactjs-tiptap-editor/callout';
import { Iframe, RichTextIframe } from 'reactjs-tiptap-editor/iframe';
import { Twitter, RichTextTwitter } from 'reactjs-tiptap-editor/twitter';
import { Table, RichTextTable } from 'reactjs-tiptap-editor/table';
import { Column, ColumnNode, MultipleColumnNode, RichTextColumn } from 'reactjs-tiptap-editor/column';
import { Katex, RichTextKatex } from 'reactjs-tiptap-editor/katex';
import { Excalidraw, RichTextExcalidraw } from 'reactjs-tiptap-editor/excalidraw';
import { Mermaid, RichTextMermaid } from 'reactjs-tiptap-editor/mermaid';
import { Drawer, RichTextDrawer } from 'reactjs-tiptap-editor/drawer';
import { Emoji, RichTextEmoji } from 'reactjs-tiptap-editor/emoji';
import { Mention } from 'reactjs-tiptap-editor/mention';
import { SlashCommand, SlashCommandList } from 'reactjs-tiptap-editor/slashcommand';
import { ExportPdf, RichTextExportPdf } from 'reactjs-tiptap-editor/exportpdf';
import { ImportWord, RichTextImportWord } from 'reactjs-tiptap-editor/importword';
import { ExportWord, RichTextExportWord } from 'reactjs-tiptap-editor/exportword';

// Bubble Menus
import {
  RichTextBubbleCallout, RichTextBubbleColumns, RichTextBubbleDrawer,
  RichTextBubbleExcalidraw, RichTextBubbleIframe, RichTextBubbleKatex,
  RichTextBubbleLink, RichTextBubbleImage, RichTextBubbleVideo,
  RichTextBubbleImageGif, RichTextBubbleMermaid, RichTextBubbleTable,
  RichTextBubbleText, RichTextBubbleTwitter, RichTextBubbleMenuDragHandle,
} from 'reactjs-tiptap-editor/bubble';

import 'reactjs-tiptap-editor/style.css';

const DocumentColumn = Document.extend({
  content: '(block|columns)+',
});

const lowlight = createLowlight(common);

const BaseKit = [
  DocumentColumn,
  Text,
  Paragraph,
  Dropcursor.configure({ color: '#7c3aed', width: 2 }),
  Gapcursor,
  HardBreak,
  TextStyle,
  ListItem,
  Placeholder.configure({ placeholder: "Ketik '/' untuk commands..." }),
];

const extensions = [
  ...BaseKit,
  History, SearchAndReplace, Clear, FontFamily, Heading, FontSize,
  Bold, Italic, TextUnderline, Strike, MoreMark, Emoji, Color, Highlight,
  BulletList, OrderedList, TaskList, TextAlign, Indent, LineHeight, Link,
  Image, Video, ImageGif, Blockquote, HorizontalRule, Code, CodeBlock.configure({ lowlight }),
  Column, ColumnNode, MultipleColumnNode, Table, Iframe, ExportPdf,
  ImportWord, ExportWord, TextDirection, Attachment, CodeView, Callout,
  Katex, Excalidraw, Mermaid, Drawer, Twitter, Mention, SlashCommand
];

const Sep = () => <div className="w-px h-6 bg-slate-200 mx-1 self-center" />;

// <-- KOMPONEN TOMBOL UPLOAD GAMBAR CUSTOM -->
const CustomImageUpload = ({ editor }) => {
  const fileInputRef = useRef(null);
  
  const handleFile = async (e) => {
     const file = e.target.files?.[0];
     if (!file) return;
     if (file.size > 500 * 1024) {
        toast.error('Maksimal 500KB!');
        e.target.value = '';
        return;
     }
     
     const toastId = toast.loading('Mengunggah gambar...');
     try {
        const ext = file.name.split('.').pop() || 'png';
        const path = `editor/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        
        const { error } = await supabase.storage.from('portfolio').upload(path, file);
        if (error) throw error;
        
        const { data } = supabase.storage.from('portfolio').getPublicUrl(path);
        
        // Memasukkan gambar ke dalam editor
        editor.chain().focus().setImage({ src: data.publicUrl }).run();
        toast.success('Berhasil diunggah!', { id: toastId });
     } catch (err) {
        toast.error('Gagal mengunggah!', { id: toastId });
     } finally {
        e.target.value = '';
     }
  };

  return (
     <>
       <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFile} className="hidden" />
       <button 
         type="button"
         onClick={() => fileInputRef.current?.click()}
         className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-200 rounded transition-colors mx-0.5"
         title="Upload Image (Max 500KB)"
       >
         <ImagePlus size={18} />
       </button>
     </>
  );
};

export default function TipTapEditor({ content, onChange }) {
  const scrollContainerRef = useRef(null);

  const editor = useEditor({
    textDirection: 'auto',
    content: content || '',
    extensions,
    // <-- PENCEGAT AGAR DRAG-DROP & PASTE LANGSUNG UPLOAD KE SUPABASE -->
    editorProps: {
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault(); // Cegah error base64 bawaan
            
            if (file.size > 500 * 1024) { 
              toast.error('Ukuran gambar di editor maksimal 500KB!');
              return true; 
            }
            
            const upload = async () => {
              const ext = file.name.split('.').pop() || 'png';
              const path = `editor/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
              const { error } = await supabase.storage.from('portfolio').upload(path, file);
              if (error) throw error;
              const { data } = supabase.storage.from('portfolio').getPublicUrl(path);
              return data.publicUrl;
            };

            toast.promise(upload(), {
              loading: 'Mengunggah file drop...',
              success: (url) => {
                const { schema } = view.state;
                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                const node = schema.nodes.image.create({ src: url });
                const transaction = view.state.tr.insert(coordinates?.pos || 0, node);
                view.dispatch(transaction);
                return 'Gambar ditambahkan!';
              },
              error: 'Gagal mengunggah!'
            });

            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event, slice) => {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault(); // Cegah error base64 bawaan

            if (file.size > 500 * 1024) { 
              toast.error('Ukuran paste maksimal 500KB!');
              return true; 
            }
            
            const upload = async () => {
              const ext = file.name.split('.').pop() || 'png';
              const path = `editor/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
              const { error } = await supabase.storage.from('portfolio').upload(path, file);
              if (error) throw error;
              const { data } = supabase.storage.from('portfolio').getPublicUrl(path);
              return data.publicUrl;
            };

            toast.promise(upload(), {
              loading: 'Mengunggah paste...',
              success: (url) => {
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src: url });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
                return 'Gambar ditempel!';
              },
              error: 'Gagal menempel gambar!'
            });

            return true;
          }
        }
        return false;
      }
    },
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    const handleGlobalWheel = (e) => {
      const isOverFloatingElement = e.target.closest('[data-tippy-root], .tippy-box, .drag-handle, .ProseMirror-drag-handle, [data-drag-handle]');
      
      if (isOverFloatingElement && scrollContainerRef.current) {
        e.preventDefault();
        scrollContainerRef.current.scrollTop += e.deltaY;
      }
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleGlobalWheel);
    };
  }, []);

  return (
    <div className="w-full">
      <RichTextProvider editor={editor}>
        <div className="border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col focus-within:border-slate-200">
          
          {/* --- AREA TOOLBAR --- */}
          <div className="p-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-y-2 rounded-t-xl sticky top-0 z-10">
            {/* History & Tools */}
            <div className="flex items-center">
              <RichTextUndo />
              <RichTextRedo />
              <RichTextSearchAndReplace />
              <RichTextClear />
            </div>
            <Sep />
            {/* Typography */}
            <div className="flex items-center">
              <RichTextFontFamily />
              <RichTextFontSize />
              <RichTextHeading />
            </div>
            <Sep />
            {/* Mark Formatting */}
            <div className="flex items-center">
              <RichTextBold />
              <RichTextItalic />
              <RichTextUnderline />
              <RichTextStrike />
              <RichTextMoreMark />
              <RichTextColor />
              <RichTextHighlight />
            </div>
            <Sep />
            {/* Alignment & Lists */}
            <div className="flex items-center">
              <RichTextAlign />
              <RichTextIndent />
              <RichTextLineHeight />
              <RichTextBulletList />
              <RichTextOrderedList />
              <RichTextTaskList />
            </div>
            <Sep />
            {/* Media & Links */}
            <div className="flex items-center">
              <RichTextLink />

              {/* <-- TOMBOL UPLOAD GAMBAR CUSTOM KITA --> */}
              <CustomImageUpload editor={editor} />
              
              <RichTextVideo />
              <RichTextImageGif />
              <RichTextAttachment />
              <RichTextEmoji />
            </div>
            <Sep />
            {/* Blocks & Layout */}
            <div className="flex items-center">
              <RichTextBlockquote />
              <RichTextHorizontalRule />
              <RichTextTable />
              <RichTextColumn />
              <RichTextCallout />
              <RichTextCode />
              <RichTextCodeBlock />
            </div>
            <Sep />
            {/* Advanced & Embeds */}
            <div className="flex items-center">
              <RichTextKatex />
              <RichTextExcalidraw />
              <RichTextMermaid />
              <RichTextIframe />
              <RichTextTwitter />
              <RichTextDrawer />
            </div>
            <Sep />
            {/* Import/Export & View */}
            <div className="flex items-center">
              <RichTextImportWord />
              <RichTextExportWord />
              <RichTextExportPdf />
              <RichTextTextDirection />
              <RichTextCodeView />
            </div>
          </div>

          {/* --- AREA EDITOR KONTEN --- */}
          <div 
            ref={scrollContainerRef}
            className="relative h-[500px] overflow-y-auto overscroll-contain"
            onWheel={(e) => {
              const el = e.currentTarget;
              const hasScrollbar = el.scrollHeight > el.clientHeight;
              if (hasScrollbar) {
                e.stopPropagation();
              }
            }}
          >
            <EditorContent 
              editor={editor}
              className="prose prose-slate max-w-none p-8 min-h-full focus:outline-none" 
            />

            <RichTextBubbleText />
            <RichTextBubbleLink />
            <RichTextBubbleImage />
            <RichTextBubbleVideo />
            <RichTextBubbleImageGif />
            <RichTextBubbleTable />
            <RichTextBubbleKatex />
            <RichTextBubbleTwitter />
            <RichTextBubbleExcalidraw />
            <RichTextBubbleMermaid />
            <RichTextBubbleDrawer />
            <RichTextBubbleColumns />
            <RichTextBubbleCallout />
            <RichTextBubbleIframe />
            
            <RichTextBubbleMenuDragHandle />
            <SlashCommandList />
          </div>

        </div>
      </RichTextProvider>
    </div>
  );
}