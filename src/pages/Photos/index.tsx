import { useState, useRef, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Camera, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { useStore } from '../../store'
import { useAuth } from '../../contexts/AuthContext'
import { PageHeader } from '../../components/layout/PageHeader'
import { dbPhotos } from '../../services/db'
import { Modal } from '../../components/ui/Modal'

export function PhotosPage() {
  const { openDrawer } = useOutletContext<{ openDrawer: () => void }>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(false)

  const photos = useStore((s) => s.photos)
  const addPhoto = useStore((s) => s.addPhoto)
  const deletePhoto = useStore((s) => s.deletePhoto)
  const { user } = useAuth()

  // Load signed URLs for all photos
  useEffect(() => {
    photos.forEach(async (p) => {
      if (!photoUrls[p.id]) {
        const url = await dbPhotos.getSignedUrl(p.blobKey)
        if (url) setPhotoUrls((prev) => ({ ...prev, [p.id]: url }))
      }
    })
  }, [photos])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    try {
      const photoId = crypto.randomUUID()
      const storagePath = await dbPhotos.uploadBlob(user.id, photoId, file)
      const url = await dbPhotos.getSignedUrl(storagePath)

      addPhoto({ id: photoId, timestamp: new Date().toISOString(), caption: '', blobKey: storagePath })
      if (url) setPhotoUrls((prev) => ({ ...prev, [photoId]: url }))

      if (url) setPhotoUrls((prev) => ({ ...prev, [photoId]: url }))
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (photoId: string, blobKey: string) => {
    await dbPhotos.deleteBlob(blobKey)
    deletePhoto(photoId)
    setPhotoUrls((prev) => { const n = { ...prev }; delete n[photoId]; return n })
  }

  return (
    <div className="page-content">
      <PageHeader title="Progress Photos" onMenuClick={openDrawer}
        action={
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="flex items-center gap-1 text-sm font-semibold text-accent active:opacity-60 disabled:opacity-40">
            <Camera size={16} />{uploading ? 'Uploading…' : 'Add'}
          </button>
        }
      />

      <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
        onChange={handleFileChange} className="hidden" />

      <div className="px-4 py-4">
        {photos.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📷</p>
            <p className="font-medium">No progress photos yet</p>
            <p className="text-sm mt-1">Tap Add to take or upload a photo</p>
            <button onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-6 py-2.5 rounded-full text-white font-semibold text-sm active:opacity-80"
              style={{ backgroundColor: 'var(--accent-color)' }}>
              Add First Photo
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative rounded-2xl overflow-hidden bg-gray-800 aspect-square">
              {photoUrls[photo.id] ? (
                <img src={photoUrls[photo.id]} alt="" className="w-full h-full object-cover"
                  onClick={() => setSelectedUrl(photoUrls[photo.id])} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">📷</div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white text-xs font-medium">
                  {format(new Date(photo.timestamp), 'MMM d, yyyy')}
                </p>
              </div>
              <button onClick={() => handleDelete(photo.id, photo.blobKey)}
                className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center">
                <Trash2 size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal open={!!selectedUrl} onClose={() => setSelectedUrl(null)} title="Photo">
        {selectedUrl && <img src={selectedUrl} alt="" className="w-full rounded-xl" />}
      </Modal>
    </div>
  )
}
