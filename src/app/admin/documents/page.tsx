'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Document {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  coverImageUrl: string | null;
  order: number;
  createdAt: string;
}

const FILE_TYPE_STYLES: Record<string, { label: string; bg: string; color: string; icon: string }> = {
  pdf:   { label: 'PDF',  bg: '#fef2f2', color: '#dc2626', icon: '📄' },
  xlsx:  { label: 'Excel', bg: '#f0fdf4', color: '#16a34a', icon: '📊' },
  docx:  { label: 'Word', bg: '#eff6ff', color: '#2563eb', icon: '📝' },
  pptx:  { label: 'PPT',  bg: '#fff7ed', color: '#ea580c', icon: '📋' },
  other: { label: 'Dosya', bg: '#f4f4f5', color: '#71717a', icon: '📎' },
};

export default function DocumentsAdminPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" belgesini silmek istediğinizden emin misiniz?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== id));
      } else {
        alert('Silme işlemi başarısız.');
      }
    } catch {
      alert('Bir hata oluştu.');
    } finally {
      setDeleting(null);
    }
  };

  const style = (type: string) => FILE_TYPE_STYLES[type] || FILE_TYPE_STYLES['other'];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dökümanlar</h1>
          <p className="text-sm text-slate-500 mt-1">PDF, Excel, Word belgelerini yönetin.</p>
        </div>
        <Link
          href="/admin/documents/new"
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Yeni Döküman Ekle
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            <span className="text-sm">Yükleniyor...</span>
          </div>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-24 text-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <p className="font-medium text-slate-600 text-lg">Henüz döküman eklenmemiş.</p>
            <p className="text-sm">PDF, Excel veya Word dosyası eklemek için yukarıdaki butonu kullanın.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Belge</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">Tür</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Açıklama</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-500">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => {
                const s = style(doc.fileType);
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        {/* Cover or type icon */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 flex items-center justify-center"
                          style={{ background: s.bg }}>
                          {doc.coverImageUrl ? (
                            <img src={doc.coverImageUrl} alt={doc.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">{s.icon}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-[200px]">{doc.title}</p>
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline mt-0.5 inline-block">
                            Dosyayı Görüntüle →
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: s.bg, color: s.color }}>
                        {s.icon} {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-slate-500 text-sm truncate max-w-[200px] block">
                        {doc.description || <span className="italic text-slate-300">—</span>}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/documents/${doc.id}/edit`}
                          className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          disabled={deleting === doc.id}
                          className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
