import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Plus, Heart, Calendar, X, ChevronLeft, ChevronRight, Download, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  date: string;
  isFavorite: boolean;
}

// 목업 데이터
const mockPhotos: GalleryPhoto[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop",
    caption: "처음 만났던 날의 하늘",
    date: "2024-03-15",
    isFavorite: true,
  },
  {
    id: "2", 
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop",
    caption: "함께 걸었던 길",
    date: "2024-02-20",
    isFavorite: false,
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=400&fit=crop",
    caption: "기다림의 시간",
    date: "2024-01-10",
    isFavorite: true,
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop",
    caption: "당신을 생각하며",
    date: "2023-12-25",
    isFavorite: false,
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    caption: "우리의 추억",
    date: "2023-11-15",
    isFavorite: true,
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    caption: "언젠가 함께 갈 곳",
    date: "2023-10-20",
    isFavorite: false,
  },
];

export function GalleryContent() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(mockPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  const filteredPhotos = filter === "favorites" 
    ? photos.filter(p => p.isFavorite) 
    : photos;

  const toggleFavorite = (id: string) => {
    setPhotos(photos.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ));
    if (selectedPhoto?.id === id) {
      setSelectedPhoto({ ...selectedPhoto, isFavorite: !selectedPhoto.isFavorite });
    }
  };

  const navigatePhoto = (direction: "prev" | "next") => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    const newIndex = direction === "prev" 
      ? (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      : (currentIndex + 1) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* 헤더 영역 */}
      <div className="p-6 border-b border-border/40">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              추억 보관소
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              기다림의 흔적을 담아두는 공간
            </p>
          </div>
          <Button className="gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-[0_4px_14px_rgba(251,146,60,0.3)]">
            <Plus className="w-4 h-4" />
            사진 추가
          </Button>
        </div>

        {/* 안내 배너 */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-xl p-4 border border-orange-200/50 dark:border-orange-800/30"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                편지 작성 시 갤러리에서 사진을 첨부할 수 있어요
              </p>
              <p className="text-xs text-muted-foreground">
                소중한 순간들을 이곳에 보관하고, 편지를 쓸 때 함께 전해보세요.
                기다림의 시간이 추억으로 채워집니다.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 필터 탭 */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            )}
          >
            전체 ({photos.length})
          </button>
          <button
            onClick={() => setFilter("favorites")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
              filter === "favorites"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", filter === "favorites" && "fill-current")} />
            즐겨찾기 ({photos.filter(p => p.isFavorite).length})
          </button>
        </div>
      </div>

      {/* 갤러리 그리드 */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center mb-4">
              <Image className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {filter === "favorites" ? "즐겨찾기한 사진이 없어요" : "아직 추억이 없어요"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-[280px]">
              {filter === "favorites" 
                ? "하트를 눌러 소중한 사진을 즐겨찾기에 추가해보세요"
                : "기다림의 순간들을 사진으로 담아보세요. 편지와 함께 전할 수 있어요."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-muted"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || "갤러리 사진"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* 즐겨찾기 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(photo.id);
                    }}
                    className={cn(
                      "absolute top-2 right-2 p-2 rounded-full transition-all",
                      photo.isFavorite 
                        ? "bg-red-500 text-white" 
                        : "bg-black/30 text-white opacity-0 group-hover:opacity-100"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", photo.isFavorite && "fill-current")} />
                  </button>
                  
                  {/* 캡션 */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.caption && (
                      <p className="text-white text-sm font-medium line-clamp-2 mb-1">
                        {photo.caption}
                      </p>
                    )}
                    <p className="text-white/70 text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(photo.date).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 사진 상세 모달 */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 이전/다음 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigatePhoto("prev");
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigatePhoto("next");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* 이미지 & 정보 */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[90vh] flex flex-col"
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || "갤러리 사진"}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
              
              {/* 사진 정보 */}
              <div className="mt-4 text-center">
                {selectedPhoto.caption && (
                  <h3 className="text-white text-lg font-medium mb-2">
                    "{selectedPhoto.caption}"
                  </h3>
                )}
                <p className="text-white/60 text-sm flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedPhoto.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                
                {/* 액션 버튼들 */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button
                    onClick={() => toggleFavorite(selectedPhoto.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                      selectedPhoto.isFavorite
                        ? "bg-red-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", selectedPhoto.isFavorite && "fill-current")} />
                    {selectedPhoto.isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 text-sm font-medium transition-all">
                    <Download className="w-4 h-4" />
                    다운로드
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-red-500/80 text-sm font-medium transition-all">
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
