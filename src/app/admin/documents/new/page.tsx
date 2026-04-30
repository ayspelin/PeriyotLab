'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ACCEPT_DOCS = '.pdf,.xls,.xlsx,.doc,.docx,.ppt,.pptx';

function getFileType(mimeType: string): string {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'xlsx';
  if (mimeType.includes('word') || mimeType.includes('wordprocessing')) return 'docx';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'pptx';
  return 'other';
}

export default function NewDocumentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', order: '0' });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCoverFile(file);
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile) { alert('Lütfen bir belge dosyası seçin.'); return; }
    if (!formData.title.trim()) { alert('Lütfen bir başlık girin.'); return; }
    setLoading(true);

    try {
      // 1. Upload document file
      const docFormData = new FormData();
      docFormData.append('file', docFile);
      const docRes = await fetch('/api/upload', { method: 'POST', body: docFormData });
      if (!docRes.ok) { alert('Döküman yüklenemedi.'); setLoading(false); return; }
      const { url: fileUrl } = await docRes.json();

      // 2. Upload cover image if provided
      let coverImageUrl: string | null = null;
      if (coverFile) {
        const coverFormData = new FormData();
        coverFormData.append('file', coverFile);
        const coverRes = await fetch('/api/upload', { method: 'POST', body: coverFormData });
        if (coverRes.ok) {
          const coverResult = await coverRes.json();
          coverImageUrl = coverResult.url;
        }
      }

      // 3. Save to DB
      const fileType = getFileType(docFile.type);
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          fileUrl,
          fileType,
          coverImageUrl,
          order: parseInt(formData.order),
        }),
      });

      if (res.ok) {
        router.push('/admin/documents');
        router.refresh();
      } else {
        alert('Kayıt sırasında sunucu hatası oluştu.');
      }
    } catch {
      alert('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/documents" className="text-sm font-semibold text-slate-500 hover:text-black transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Dökümanlar
        </Link>
        <h1 className="text-2xl font-bold mt-4 text-slate-900">Yeni Döküman Ekle</h1>
        <p className="text-sm text-slate-500 mt-1">PDF, Excel, Word veya PowerPoint dosyası yükleyin.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document File Upload */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Belge Dosyası</h2>

          <label className={`block w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${docFile ? 'border-black bg-zinc-50' : 'border-slate-300 hover:border-black'}`}>
            {docFile ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">
                  {docFile.type.includes('pdf') ? '📄' :
                   docFile.type.includes('excel') || docFile.type.includes('sheet') ? '📊' :
                   docFile.type.includes('word') ? '📝' : '📎'}
                </span>
                <p className="font-semibold text-slate-900">{docFile.name}</p>
                <p className="text-xs text-slate-400">{(docFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <span className="text-xs text-green-600 font-medium">✓ Dosya seçildi</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                <div>
                  <p className="font-semibold text-slate-600">Dosya seçmek için tıklayın</p>
                  <p className="text-xs mt-1">PDF, Excel (.xlsx), Word (.docx), PowerPoint (.pptx)</p>
                </div>
              </div>
            )}
            <input type="file" accept={ACCEPT_DOCS} className="hidden" onChange={e => setDocFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>

        {/* Meta */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Belge Bilgileri</h2>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Başlık <span className="text-red-500">*</span></label>
            <input
              required type="text"
              placeholder="örn. 2024 Ürün Kataloğu"
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Açıklama <span className="text-slate-400 font-normal">(opsiyonel)</span></label>
            <textarea
              rows={3}
              placeholder="Döküman hakkında kısa bir açıklama..."
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Sıra Numarası</label>
            <input
              type="number" min="0"
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
              value={formData.order}
              onChange={e => setFormData({ ...formData, order: e.target.value })}
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Kapak Görseli <span className="text-slate-400 font-normal normal-case">(opsiyonel)</span></h2>
          <p className="text-xs text-slate-500">Döküman kartında görünecek kapak fotoğrafı. Seçmezseniz dosya tipi ikonu kullanılır.</p>

          <div className={`relative w-full h-48 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-colors ${coverPreview ? 'border-slate-300 bg-slate-50' : 'border-slate-300 hover:border-black bg-slate-50'}`}>
            {coverPreview ? (
              <img src={coverPreview} alt="Kapak önizleme" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400 pointer-events-none">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span className="text-sm font-medium">Kapak görseli seçin</span>
                <span className="text-xs">PNG, JPG, WebP</span>
              </div>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleCoverChange} />
          </div>
          {coverPreview && (
            <button type="button" onClick={() => { setCoverPreview(null); setCoverFile(null); }}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
              Kapak Görselini Kaldır
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/admin/documents"
            className="flex-1 text-center py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm">
            İptal
          </Link>
          <button type="submit" disabled={loading}
            className="flex-1 py-3 bg-black text-white font-semibold rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 text-sm">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Yükleniyor...
              </span>
            ) : 'Dökümanı Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
