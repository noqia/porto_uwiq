import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { supabase } from '../../services/supabaseClient';
import toast from 'react-hot-toast';

export default function TipTapEditor({ content, onChange }) {
  const editorRef = useRef(null);

  // --- FUNGSI UPLOAD GAMBAR KE SUPABASE ---
  const handleImageUpload = (blobInfo, progress) => {
    return new Promise(async (resolve, reject) => {
      const file = blobInfo.blob();
      
      if (file.size > 500 * 1024) {
        toast.error('Ukuran gambar maksimal 500KB!');
        reject({ message: 'Ukuran file terlalu besar', remove: true });
        return;
      }

      const toastId = toast.loading('Mengunggah gambar...');
      try {
        const ext = file.name ? file.name.split('.').pop() : 'png';
        const path = `editor/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        
        const { error } = await supabase.storage.from('portfolio').upload(path, file);
        if (error) throw error;
        
        const { data } = supabase.storage.from('portfolio').getPublicUrl(path);
        
        toast.success('Gambar berhasil diunggah!', { id: toastId });
        resolve(data.publicUrl); 
      } catch (err) {
        console.error(err);
        toast.error('Gagal mengunggah gambar!', { id: toastId });
        reject({ message: 'Gagal mengunggah ke server' });
      }
    });
  };

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm border border-slate-200">
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY} 
        onInit={(evt, editor) => editorRef.current = editor}
        value={content}
        onEditorChange={(newContent) => {
          if (onChange) onChange(newContent);
        }}
        init={{
          height: 600, // Dibuat lebih tinggi agar area ngetik lebih lega
          menubar: true, // MENGAKTIFKAN MENU BAR (File, Edit, View, Format, dll)
          
          // MENGAKTIFKAN SEMUA PLUGIN PENTING
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount',
            'emoticons', 'codesample', 'directionality', 'pagebreak', 'nonbreaking', 'visualchars'
          ],
          
          // TOOLBAR SUPER LENGKAP
          toolbar: 
            'undo redo | fontfamily fontsize blocks | ' +
            'bold italic underline strikethrough superscript subscript | ' +
            'forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | ' +
            'link image media table hr pagebreak | ' +
            'emoticons charmap codesample blockquote | ' +
            'ltr rtl | fullscreen preview code | removeformat help',
            
          // Pengaturan Gambar
          image_title: true,
          automatic_uploads: true,
          images_upload_handler: handleImageUpload,
          file_picker_types: 'image',
          
          // Styling di dalam Editor
          content_style: `
            body { 
              font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif; 
              font-size: 16px; 
              color: #334155;
              line-height: 1.6;
            }
            img { border-radius: 8px; max-width: 100%; height: auto; }
            table { border-collapse: collapse; width: 100%; }
            table, th, td { border: 1px solid #cbd5e1; padding: 8px; }
            /* Styling khusus untuk fitur blok kode (codesample) */
            pre { background-color: #1e293b; color: #f8fafc; padding: 1rem; border-radius: 8px; overflow-x: auto; }
          `,
          
          skin: 'oxide',
          content_css: 'default',
          branding: false,
          promotion: false
        }}
      />
    </div>
  );
}