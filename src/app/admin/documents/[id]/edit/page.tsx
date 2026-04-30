'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const ACCEPT_DOCS = '.pdf,.xls,.xlsx,.doc,.docx,.ppt,.pptx';

function getFileType(mimeType: string): string {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'xlsx';
  if (mimeType.includes('word') || mimeType.includes('wordprocessing')) return 'docx';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'pptx';
  return 'other';
}

export default function EditDocumentPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [currentDoc, setCurrentDoc] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '', order: '0' });

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await fetch(`/api/documents/${id}`);
        if (!res.ok) { alert('Döküman bulunamadı.'); router.push('/admin/documents'); return; }
        const doc = await res.json();
        setCurrentDoc(doc);
        setFormData({ title: doc.title, description: doc.description || '', order: String(doc.order) });
        if (doc.coverImageUrl) setCoverPreview(doc.coverImageUrl);
      } catch {
        alert('Veri çekilirken hata oluştu.');
      } finally {
        setFetching(false);
      }
    };
    fetchDoc();
  }, [id]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCoverFile(file);
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileUrl = currentDoc?.fileUrl;
      let fileType = currentDoc?.fileType;

      // Upload new document if replaced
      if (docFile) {
        const df = new FormData();
        df.append('file', docFile);
        const dRes = await fetch('/api/upload', { method: 'POST', body: df });
        if (!dRes.ok) { alert('Dosya yüklenemedi.'); setLoading(false); return; }
        const dResult = await dRes.json();
        fileUrl = dResult.url;
        fileType = getFileType(docFile.type);
      }

      // Upload new cover if replaced
      let coverImageUrl = currentDoc?.coverImageUrl ?? null;
      if (coverFile) {
        const cf = new FormData();
        cf.append('file', coverFile);
        const cRes = await fetch('/api/upload', { method: 'POST', body: cf });
        if (cRes.ok) {
          const cResult = await cRes.json();
          coverImageUrl = cResult.url;
        }
      } else if (!coverPreview) {
        // User removed cover
        coverImageUrl = null;
      }

      const res = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
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
        alert('Güncelleme sırasında sunucu hatası oluştu.');
      }
    } catch {
      alert('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg className="w-8 h-8 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/documents" className="text-sm font-semibold text-slate-500 hover:text-black transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Dökümanlar
        </Link>
        <h1 className="text-2xl font-bold mt-4 text-slate-900">Dökümanı Düzenle</h1>
        <p className="text-sm text-slate-500 mt-1">Bilgileri güncelleyin. Dosya seçmezseniz mevcut dosya korunur.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current file info */}
        {currentDoc && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-xl flex-shrink-0">
              {currentDoc.fileType === 'pdf' ? '📄' : currentDoc.fileType === 'xlsx' ? '📊' : currentDoc.fileType === 'docx' ? '📝' : '📎'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-700 truncate">Mevcut dosya</p>
              <a href={currentDoc.fileUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline">Görüntüle →</a>
            </div>
            <label className="text-xs bg-black text-white px-3 py-1.5 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors flex-shrink-0">
              Değiştir
              <input type="file" accept={ACCEPT_DOCS} className="hidden" onChange={e => setDocFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
        )}
        {docFile && (
          <p className="text-xs text-green-600 font-medium">✓ Yeni dosya seçildi: {docFile.name}</p>
        )}

        {/* Meta */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Başlık <span className="text-red-500">*</span></label>
            <input required type="text"
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
              value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Açıklama</label>
            <textarea rows={3}
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors resize-none"
              value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Sıra Numarası</label>
            <input type="number" min="0"
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
              value={formData.order} onChange={e => setFormData({ ...formData, order: e.target.value })} />
          </div>
        </div>

        {/* Cover */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Kapak Görseli</h2>
          <div className={`relative w-full h-48 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-colors ${coverPreview ? 'border-slate-300 bg-slate-50' : 'border-slate-300 hover:border-black bg-slate-50'}`}>
            {coverPreview ? (
              <img src={coverPreview} alt="Kapak" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400 pointer-events-none">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span className="text-sm font-medium">Kapak görseli seçin</span>
              </div>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleCoverChange} />
          </div>
          {coverPreview && (
            <button type="button"
              onClick={() => { setCoverPreview(null); setCoverFile(null); }}
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
            {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
