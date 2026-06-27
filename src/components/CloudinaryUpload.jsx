import { useState } from 'react';
import { Upload, Loader2, X, Image as ImageIcon, FileText } from 'lucide-react';
import { api } from '../api/api';

/**
 * Reusable Cloudinary upload field for admin drawers.
 * Accepts images and/or documents (pdf, doc, docx).
 *
 * Props:
 *   value        - current URL string
 *   onChange     - (url: string) => void
 *   accept       - MIME types string, default "image/*"
 *   label        - field label text
 *   folder       - Cloudinary sub-folder hint (informational only, server decides)
 *   previewType  - "image" | "file" — controls preview rendering
 */
export default function CloudinaryUpload({
  value = '',
  onChange,
  accept = 'image/*',
  label = 'Upload File',
  previewType = 'image',
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const isImage = previewType === 'image';

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.uploadFile(formData);
      if (res.success && res.url) {
        onChange(res.url);
      } else {
        setError('Upload failed — please try again.');
      }
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      // reset input so re-uploading same file triggers onChange
      e.target.value = '';
    }
  };

  const fieldId = `upload-${label.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[10px] uppercase font-semibold text-slate-500">{label}</label>
      )}

      {/* Preview */}
      {value && (
        <div className="relative group w-full mb-1">
          {isImage ? (
            <img
              src={value}
              alt="Upload preview"
              className="w-full h-32 object-cover rounded-lg border border-brand-slateAccent"
            />
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-brand-slateAccent bg-brand-slateAccent/20">
              <FileText size={18} className="text-brand-primary shrink-0" />
              <span className="text-[10px] text-slate-400 truncate">{value.split('/').pop()}</span>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="ml-auto text-[9px] text-brand-primary hover:underline shrink-0"
              >
                View
              </a>
            </div>
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1.5 right-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove file"
          >
            <X size={10} />
          </button>
        </div>
      )}

      {/* Upload button + dropzone */}
      <label
        htmlFor={fieldId}
        className={`flex flex-col items-center justify-center gap-1.5 border border-dashed border-brand-slateAccent rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors ${uploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        {uploading ? (
          <>
            <Loader2 size={18} className="animate-spin text-brand-primary" />
            <span className="text-[10px] text-slate-400">Uploading to Cloudinary…</span>
          </>
        ) : (
          <>
            {isImage ? <ImageIcon size={18} className="text-slate-500" /> : <FileText size={18} className="text-slate-500" />}
            <span className="text-[10px] text-slate-400 font-semibold">
              {value ? 'Replace file' : 'Click or drag to upload'}
            </span>
            <span className="text-[8px] text-slate-500">Stored on Cloudinary CDN</span>
          </>
        )}
        <input
          id={fieldId}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {/* Optional URL paste fallback */}
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste a URL directly…"
        className="admin-input text-[10px] mt-1"
      />

      {error && <p className="text-[9px] text-red-400">{error}</p>}
    </div>
  );
}
