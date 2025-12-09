import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Sparkles, Plus, X, ZoomIn, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PhotoFile {
  id: string;
  file: File;
  preview: string;
  rotation: number;
}

interface PhotoUploadProps {
  photos: PhotoFile[];
  onPhotosChange: (photos: PhotoFile[]) => void;
  maxPhotos?: number;
}

export function PhotoUpload({ photos, onPhotosChange, maxPhotos = 10 }: PhotoUploadProps) {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxPhotos - photos.length;
    if (remainingSlots <= 0) {
      toast.error(`최대 ${maxPhotos}장까지 추가할 수 있습니다`);
      return;
    }

    const newPhotos: PhotoFile[] = [];
    const filesToProcess = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        toast.error("이미지 파일만 업로드할 수 있습니다");
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("파일 크기는 10MB 이하여야 합니다");
        continue;
      }

      const preview = URL.createObjectURL(file);
      newPhotos.push({
        id: `${Date.now()}-${i}`,
        file,
        preview,
        rotation: 0,
      });
    }

    if (newPhotos.length > 0) {
      onPhotosChange([...photos, ...newPhotos]);
      toast.success(`${newPhotos.length}장의 사진이 추가되었습니다`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (photo) {
      URL.revokeObjectURL(photo.preview);
    }
    onPhotosChange(photos.filter((p) => p.id !== id));
    if (selectedPhotoId === id) {
      setSelectedPhotoId(null);
    }
  };

  const handleRotatePhoto = (id: string) => {
    onPhotosChange(
      photos.map((p) =>
        p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    );
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 flex items-center justify-center">
          <Image className="w-7 h-7 text-pink-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">사진 출력 추가</h2>
          <p className="text-muted-foreground text-sm">편지와 함께 사진을 동봉해보세요</p>
        </div>
      </div>

      {/* 사진 인화 서비스 안내 */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-card flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">사진 인화 서비스</h3>
            <p className="text-sm text-muted-foreground">
              업로드하신 사진은 <span className="text-pink-600 dark:text-pink-400 font-medium">고품질 사진 인화지에 인화</span>되어 편지와 함께 동봉됩니다. 소중한 추억을 선물하세요!
            </p>
          </div>
        </div>
      </div>

      {/* 사진 그리드 */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* 업로드된 사진들 */}
          <AnimatePresence>
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden border-2 border-border group"
              >
                <img
                  src={photo.preview}
                  alt="업로드된 사진"
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{ transform: `rotate(${photo.rotation}deg)` }}
                />
                
                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleRotatePhoto(photo.id)}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    title="회전"
                  >
                    <RotateCw className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => setSelectedPhotoId(photo.id)}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    title="확대"
                  >
                    <ZoomIn className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 사진 추가 버튼 */}
          {photos.length < maxPhotos && (
            <button
              onClick={openFilePicker}
              className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">추가</span>
            </button>
          )}
        </div>

        {/* 사진 개수 표시 */}
        {photos.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {photos.length} / {maxPhotos}장 업로드됨
            </span>
            <span className="text-primary font-medium">
              +{photos.length * 500}원
            </span>
          </div>
        )}

        {/* 안내 메시지 */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          사진을 추가하지 않으셔도 진행 가능해요
        </p>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* 가격 안내 */}
      <div className="bg-muted/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">사진 인화 비용</p>
            <p className="text-sm text-muted-foreground">1장당 500원 (4x6 사이즈)</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {(photos.length * 500).toLocaleString()}원
            </p>
            <p className="text-xs text-muted-foreground">{photos.length}장 선택</p>
          </div>
        </div>
      </div>

      {/* 사진 확대 모달 */}
      <AnimatePresence>
        {selectedPhotoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedPhotoId(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos.find((p) => p.id === selectedPhotoId)?.preview}
                alt="확대된 사진"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                style={{
                  transform: `rotate(${photos.find((p) => p.id === selectedPhotoId)?.rotation || 0}deg)`,
                }}
              />
              <button
                onClick={() => setSelectedPhotoId(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
