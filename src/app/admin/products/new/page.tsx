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

function getDocIcon(type: string) {
  if (type === 'pdf') return '📄';
  if (type === 'xlsx') return '📊';
  if (type === 'docx') return '📝';
  if (type === 'pptx') return '📋';
  return '📎';
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    documentTitle: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image
      let imageUrl = null;
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        if (uploadRes.ok) {
          const result = await uploadRes.json();
          imageUrl = result.url;
        } else {
          alert('Resim yüklenirken hata oluştu.');
          setLoading(false);
          return;
        }
      }

      // Upload document
      let documentUrl = null;
      let documentType = null;
      if (docFile) {
        const docData = new FormData();
        docData.append('file', docFile);
        const docRes = await fetch('/api/upload', { method: 'POST', body: docData });
        if (docRes.ok) {
          const result = await docRes.json();
          documentUrl = result.url;
          documentType = getFileType(docFile.type);
        } else {
          alert('Döküman yüklenirken hata oluştu.');
          setLoading(false);
          return;
        }
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          documentUrl,
          documentType,
          documentTitle: formData.documentTitle || (docFile?.name ?? null),
        }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        alert('Ürün eklenirken sunucu hatası oluştu.');
      }
    } catch (error) {
      alert('Bir hata oluştu. Bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin" className="text-sm font-semibold text-slate-500 hover:text-black transition-colors flex items-center gap-2">
          ← Geri Dön
        </Link>
        <h1 className="text-2xl font-bold mt-4 text-slate-900">Yeni Ürün Ekle</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Ürün Adı</label>
            <input required type="text"
              className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-slate-900 text-sm"
              value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Kategori</label>
              <input required type="text"
                className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-slate-900 text-sm"
                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Ürün Görseli</label>
              <input type="file" accept="image/*"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:border-black outline-none text-slate-900 text-sm"
                onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Açıklama</label>
            <textarea required rows={4}
              className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-slate-900 text-sm resize-none"
              value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>
        </div>

        {/* Document Upload */}
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Ürün Belgesi</h3>
            <p className="text-xs text-slate-500 mt-1">Ürünle ilgili bir PDF, Excel veya Word dosyası ekleyebilirsiniz (opsiyonel).</p>
          </div>

          <label className={`block w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${docFile ? 'border-black bg-zinc-50' : 'border-slate-300 hover:border-black'}`}>
            {docFile ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">{getDocIcon(getFileType(docFile.type))}</span>
                <p className="font-semibold text-slate-900 text-sm">{docFile.name}</p>
                <p className="text-xs text-slate-400">{(docFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <span className="text-xs text-green-600 font-medium">✓ Dosya seçildi</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                <p className="font-medium text-sm text-slate-600">Belge seçmek için tıklayın</p>
                <p className="text-xs">PDF, Excel, Word, PowerPoint</p>
              </div>
            )}
            <input type="file" accept={ACCEPT_DOCS} className="hidden" onChange={e => setDocFile(e.target.files?.[0] ?? null)} />
          </label>

          {docFile && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Belge Görünen Adı <span className="text-slate-400 font-normal">(opsiyonel)</span></label>
              <input type="text" placeholder={docFile.name}
                className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-slate-900 text-sm"
                value={formData.documentTitle} onChange={e => setFormData({ ...formData, documentTitle: e.target.value })} />
              <p className="text-xs text-slate-400">Boş bırakırsanız dosya adı kullanılır.</p>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 text-sm">
          {loading ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
        </button>
      </form>
    </div>
  );
}
