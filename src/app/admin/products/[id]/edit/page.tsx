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

function getDocIcon(type: string | null) {
  if (type === 'pdf') return 'PDF';
  if (type === 'xlsx') return 'XLS';
  if (type === 'docx') return 'DOC';
  if (type === 'pptx') return 'PPT';
  return 'DOSYA';
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [removeDoc, setRemoveDoc] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    imageUrl: null as string | null,
    documentUrl: null as string | null,
    documentTitle: '',
    documentType: null as string | null,
    isFeatured: false,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name,
            description: data.description,
            category: data.category,
            imageUrl: data.imageUrl,
            documentUrl: data.documentUrl,
            documentTitle: data.documentTitle || '',
            documentType: data.documentType,
            isFeatured: data.isFeatured || false,
          });
        } else {
          alert('Ürün bulunamadı');
          router.push('/admin/products');
        }
      } catch (error) {
        console.error('Fetch error', error);
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchProduct();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        if (uploadRes.ok) {
          finalImageUrl = (await uploadRes.json()).url;
        } else {
          alert('Resim yüklenirken hata oluştu.');
          setLoading(false);
          return;
        }
      }

      let finalDocUrl = removeDoc ? null : formData.documentUrl;
      let finalDocType = removeDoc ? null : formData.documentType;
      let finalDocTitle = removeDoc ? null : (formData.documentTitle || null);

      if (docFile) {
        const docData = new FormData();
        docData.append('file', docFile);
        const docRes = await fetch('/api/upload', { method: 'POST', body: docData });
        if (docRes.ok) {
          finalDocUrl = (await docRes.json()).url;
          finalDocType = getFileType(docFile.type);
          finalDocTitle = formData.documentTitle || docFile.name;
        } else {
          alert('Belge yüklenirken hata oluştu.');
          setLoading(false);
          return;
        }
      }

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          imageUrl: finalImageUrl,
          documentUrl: finalDocUrl,
          documentTitle: finalDocTitle,
          documentType: finalDocType,
          isFeatured: formData.isFeatured,
        }),
      });

      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        alert('Ürün güncellenirken sunucu hatası oluştu.');
      }
    } catch {
      alert('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(e.target.files?.[0] ?? null);
  };

  const clearSelectedImage = () => {
    setImageFile(null);
    setImageInputKey((key) => key + 1);
  };

  const removeCurrentImage = () => {
    if (!confirm('Bu ürün görselini kaldırmak istediğinize emin misiniz? Ürün kaydı silinmez.')) return;
    setFormData({ ...formData, imageUrl: null });
    clearSelectedImage();
  };

  if (fetching) return <div className="p-8 text-slate-500 text-sm">Yükleniyor...</div>;

  const hasDoc = !removeDoc && (formData.documentUrl || docFile);

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/products" className="text-sm font-semibold text-slate-500 hover:text-black transition-colors flex items-center gap-2">
          ← Geri Dön
        </Link>
        <h1 className="text-2xl font-bold mt-4 text-slate-900">Ürünü Düzenle</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Temel bilgiler */}
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
              <label className="text-sm font-medium text-slate-700">Görsel (değiştirmek için seçin)</label>
              {formData.imageUrl && !imageFile && (
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <img src={formData.imageUrl} alt="Mevcut" className="h-12 w-12 rounded border border-slate-200 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-700">Mevcut görsel</p>
                    <p className="text-xs text-slate-400">Yeni görsel seçmezseniz korunur.</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeCurrentImage}
                    className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Görseli Sil
                  </button>
                </div>
              )}
              {imageFile && (
                <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-700">{imageFile.name}</p>
                    <p className="text-xs font-medium text-green-600">Yeni görsel seçildi.</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearSelectedImage}
                    className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                  >
                    İptal
                  </button>
                </div>
              )}
              {!formData.imageUrl && !imageFile && (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-sm font-semibold text-slate-400">
                  Görsel yok
                </div>
              )}
              <input key={imageInputKey} type="file" accept="image/*"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:border-black outline-none text-slate-900 text-sm"
                onChange={handleImageChange} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Açıklama</label>
            <textarea required rows={4}
              className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-slate-900 text-sm resize-none"
              value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="flex items-center space-x-3 mt-4">
            <input type="checkbox" id="isFeatured"
              className="w-4 h-4 text-black border-slate-300 rounded focus:ring-black"
              checked={formData.isFeatured} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} />
            <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700">Anasayfada Göster (Öne Çıkan Ürün)</label>
          </div>
        </div>

        {/* Ürün belgesi */}
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Ürün Belgesi</h3>
            <p className="text-xs text-slate-500 mt-1">PDF, Excel, Word veya PowerPoint belgesi ekleyebilirsiniz (opsiyonel).</p>
          </div>

          {/* Mevcut belge */}
          {formData.documentUrl && !removeDoc && !docFile && (
            <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl p-4">
              <span className="rounded-lg bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-800">{getDocIcon(formData.documentType)}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-700 truncate">{formData.documentTitle || 'Mevcut belge'}</p>
                <a href={formData.documentUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline">Görüntüle →</a>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <label className="text-xs bg-black text-white px-3 py-1.5 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors">
                  Değiştir
                  <input type="file" accept={ACCEPT_DOCS} className="hidden" onChange={e => { setDocFile(e.target.files?.[0] ?? null); setRemoveDoc(false); }} />
                </label>
                <button type="button" onClick={() => setRemoveDoc(true)}
                  className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                  Kaldır
                </button>
              </div>
            </div>
          )}

          {/* Yeni belge seçildi */}
          {docFile && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
              <span className="rounded-lg bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-800">{getDocIcon(getFileType(docFile.type))}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-700 truncate">{docFile.name}</p>
                <p className="text-xs text-green-600">✓ Yeni dosya seçildi</p>
              </div>
              <button type="button" onClick={() => setDocFile(null)}
                className="text-xs text-red-500 hover:text-red-700 font-medium">İptal</button>
            </div>
          )}

          {/* Belge yok veya kaldırıldı */}
          {!formData.documentUrl || removeDoc ? (
            !docFile && (
              <label className="block w-full border-2 border-dashed border-slate-300 hover:border-black rounded-xl p-6 text-center cursor-pointer transition-all">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                  <p className="font-medium text-sm text-slate-600">Belge seçmek için tıklayın</p>
                  <p className="text-xs">PDF, Excel, Word, PowerPoint</p>
                </div>
                <input type="file" accept={ACCEPT_DOCS} className="hidden" onChange={e => { setDocFile(e.target.files?.[0] ?? null); setRemoveDoc(false); }} />
              </label>
            )
          ) : null}

          {/* Belge başlığı */}
          {hasDoc && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Belge Görünen Adı</label>
              <input type="text" placeholder="Teknik Belge, Ürün Kataloğu..."
                className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-slate-900 text-sm"
                value={formData.documentTitle} onChange={e => setFormData({ ...formData, documentTitle: e.target.value })} />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 text-sm">
          {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  );
}
