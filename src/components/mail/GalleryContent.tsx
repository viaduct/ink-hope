import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image, Plus, Heart, Calendar, X, ChevronLeft, ChevronRight,
  Download, Trash2, FolderPlus, MoreVertical, Pencil, Mail,
  List, Grid3X3, Check, Clock, Send, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryContentProps {
  onClose?: () => void;
}

interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  date: string;
  isFavorite: boolean;
  folderId?: string; // null이면 미분류
  sentTo?: string; // 발송된 수신자 이름
  sentDate?: string; // 발송 날짜
}

interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

// 목업 폴더 데이터
const mockFolders: Folder[] = [
  { id: "folder-1", name: "가족사진", createdAt: "2024-03-01" },
  { id: "folder-2", name: "일상", createdAt: "2024-02-15" },
];

// 목업 데이터 (15개 - 5개 x 3줄)
const mockPhotos: GalleryPhoto[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop",
    caption: "처음 만났던 날의 하늘",
    date: "2024-03-15",
    isFavorite: true,
    folderId: "folder-1",
    sentTo: "이재원",
    sentDate: "2024-03-20",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop",
    caption: "함께 걸었던 길",
    date: "2024-02-20",
    isFavorite: false,
    folderId: "folder-2",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=400&fit=crop",
    caption: "기다림의 시간",
    date: "2024-01-10",
    isFavorite: true,
    sentTo: "이재원",
    sentDate: "2024-01-15",
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
    folderId: "folder-1",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    caption: "언젠가 함께 갈 곳",
    date: "2023-10-20",
    isFavorite: false,
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
    caption: "새벽 산책",
    date: "2023-10-15",
    isFavorite: false,
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop",
    caption: "초록빛 추억",
    date: "2023-10-10",
    isFavorite: true,
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
    caption: "숲속의 빛",
    date: "2023-09-25",
    isFavorite: false,
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop",
    caption: "안개 낀 아침",
    date: "2023-09-20",
    isFavorite: false,
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=400&fit=crop",
    caption: "폭포와 다리",
    date: "2023-09-15",
    isFavorite: true,
    sentTo: "이재원",
    sentDate: "2023-09-20",
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=400&fit=crop",
    caption: "가을 숲길",
    date: "2023-09-10",
    isFavorite: false,
  },
  {
    id: "13",
    url: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=400&fit=crop",
    caption: "노을 지는 바다",
    date: "2023-09-05",
    isFavorite: true,
  },
  {
    id: "14",
    url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop",
    caption: "나비와 꽃",
    date: "2023-08-30",
    isFavorite: false,
  },
  {
    id: "15",
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=400&fit=crop",
    caption: "산 정상에서",
    date: "2023-08-25",
    isFavorite: true,
  },
];

export function GalleryContent({ onClose }: GalleryContentProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(mockPhotos);
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [filter, setFilter] = useState<"all" | "favorites" | "recent" | "sent">("all");
  const [viewMode, setViewMode] = useState<"thumbnail" | "list">("thumbnail");
  const [showFolderCreatePopup, setShowFolderCreatePopup] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderMenuOpen, setFolderMenuOpen] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folderFilter, setFolderFilter] = useState<"all" | "favorites" | "recent" | "sent">("all");
  const folderInputRef = useRef<HTMLInputElement>(null);

  // 선택된 폴더 정보
  const selectedFolder = selectedFolderId ? folders.find(f => f.id === selectedFolderId) : null;

  // 미분류 사진 (폴더에 속하지 않은 사진들) - 시간순 정렬
  const unclassifiedPhotos = photos
    .filter(p => !p.folderId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 필터링된 사진
  const getFilteredPhotos = () => {
    let filtered = photos;
    switch (filter) {
      case "favorites":
        filtered = photos.filter(p => p.isFavorite);
        break;
      case "recent":
        filtered = [...photos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "sent":
        filtered = photos.filter(p => p.sentTo);
        break;
      default:
        filtered = photos;
    }
    return filtered;
  };

  const filteredPhotos = getFilteredPhotos();

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

  // 폴더 생성
  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setShowFolderCreatePopup(false);
  };

  // 폴더 삭제
  const deleteFolder = (folderId: string) => {
    setFolders(folders.filter(f => f.id !== folderId));
    // 폴더 내 사진들은 미분류로 변경
    setPhotos(photos.map(p => p.folderId === folderId ? { ...p, folderId: undefined } : p));
    setFolderMenuOpen(null);
  };

  // 폴더 이름 변경
  const renameFolder = (folderId: string) => {
    if (!editFolderName.trim()) return;
    setFolders(folders.map(f => f.id === folderId ? { ...f, name: editFolderName.trim() } : f));
    setEditingFolderId(null);
    setEditFolderName("");
  };

  // 폴더 내 사진 수
  const getPhotoCountInFolder = (folderId: string) => {
    return photos.filter(p => p.folderId === folderId).length;
  };

  // 폴더 내 사진 필터링
  const getFolderPhotos = () => {
    if (!selectedFolderId) return [];
    let folderPhotos = photos.filter(p => p.folderId === selectedFolderId);

    switch (folderFilter) {
      case "favorites":
        folderPhotos = folderPhotos.filter(p => p.isFavorite);
        break;
      case "recent":
        folderPhotos = [...folderPhotos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "sent":
        folderPhotos = folderPhotos.filter(p => p.sentTo);
        break;
      default:
        break;
    }
    return folderPhotos;
  };

  const folderPhotos = getFolderPhotos();

  // 사진 렌더링 컴포넌트
  const PhotoItem = ({ photo, index }: { photo: GalleryPhoto; index: number }) => {
    if (viewMode === "list") {
      return (
        <motion.div
          key={photo.id}
          layout
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ delay: index * 0.03 }}
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
          onClick={() => setSelectedPhoto(photo)}
        >
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={photo.url}
              alt={photo.caption || "갤러리 사진"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {photo.caption || "제목 없음"}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <Calendar className="w-3 h-3" />
              {new Date(photo.date).toLocaleDateString("ko-KR")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {photo.isFavorite && (
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            )}
          </div>
          {/* 발송 완료 표시 */}
          {photo.sentTo && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded-[17px]">
              <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                </svg>
              </div>
              <span>발송 1회</span>
            </div>
          )}
        </motion.div>
      );
    }

    // 썸네일 뷰
    return (
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

        {/* 즐겨찾기 표시 */}
        {photo.isFavorite && (
          <div className="absolute top-2 right-2">
            <Heart className="w-5 h-5 text-white fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
          </div>
        )}

        {/* 발송 완료 표시 */}
        {photo.sentTo && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-xs text-white bg-black/50 px-2.5 py-1.5 rounded-[17px]">
            <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
              </svg>
            </div>
            <span>발송 1회</span>
          </div>
        )}

        {/* 캡션 (발송 완료가 없을 때만) */}
        {!photo.sentTo && (
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
        )}
      </motion.div>
    );
  };

  // 폴더 카드 컴포넌트
  const FolderCard = ({ folder }: { folder: Folder }) => {
    const photoCount = getPhotoCountInFolder(folder.id);

    return (
      <div className="relative group">
        <div
          className="bg-orange-50 rounded-xl px-4 py-3 cursor-pointer hover:bg-orange-100 transition-colors flex items-center gap-3"
          onClick={() => {
            setSelectedFolderId(folder.id);
            setFolderFilter("all");
          }}
        >
          {/* 폴더 아이콘 */}
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-orange-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
          </div>

          {/* 폴더 이름 */}
          <div className="flex-1 min-w-0">
            {editingFolderId === folder.id ? (
              <input
                ref={folderInputRef}
                type="text"
                value={editFolderName}
                onChange={(e) => setEditFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") renameFolder(folder.id);
                  if (e.key === "Escape") {
                    setEditingFolderId(null);
                    setEditFolderName("");
                  }
                }}
                onBlur={() => renameFolder(folder.id)}
                className="w-full text-sm font-medium bg-white border border-orange-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                autoFocus
              />
            ) : (
              <p className="text-sm font-medium text-gray-900 truncate">{folder.name}</p>
            )}
          </div>

          {/* 더보기 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFolderMenuOpen(folderMenuOpen === folder.id ? null : folder.id);
            }}
            className="flex-shrink-0 p-1 rounded-full hover:bg-orange-200 transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* 폴더 메뉴 */}
        <AnimatePresence>
          {folderMenuOpen === folder.id && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-10 right-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-[180px]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  // 다운로드 기능
                  setFolderMenuOpen(null);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                다운로드
              </button>
              <button
                onClick={() => {
                  setEditingFolderId(folder.id);
                  setEditFolderName(folder.name);
                  setFolderMenuOpen(null);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Pencil className="w-4 h-4" />
                이름 바꾸기
              </button>
              <button
                onClick={() => {
                  // 편지쓰기로 사진동봉 기능
                  setFolderMenuOpen(null);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Mail className="w-4 h-4" />
                편지쓰기로 사진동봉
              </button>
              <hr className="my-2 border-gray-100" />
              <button
                onClick={() => deleteFolder(folder.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                휴지통으로 이동
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // 폴더 상세 화면
  if (selectedFolder) {
    const allFolderPhotos = photos.filter(p => p.folderId === selectedFolderId);

    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        {/* Header */}
        <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center px-6 gap-3">
          <button
            onClick={() => setSelectedFolderId(null)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
            <h1 className="text-lg font-semibold text-foreground">{selectedFolder.name}</h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-4 py-10 lg:px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 필터 탭 */}
            <div className="flex gap-2">
              <button
                onClick={() => setFolderFilter("all")}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  folderFilter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                )}
              >
                전체 ({allFolderPhotos.length})
              </button>
              <button
                onClick={() => setFolderFilter("favorites")}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                  folderFilter === "favorites"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                )}
              >
                <Heart className={cn("w-3.5 h-3.5", folderFilter === "favorites" && "fill-current")} />
                즐겨찾기 ({allFolderPhotos.filter(p => p.isFavorite).length})
              </button>
              <button
                onClick={() => setFolderFilter("recent")}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                  folderFilter === "recent"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                )}
              >
                <Clock className={cn("w-3.5 h-3.5")} />
                등록순
              </button>
              <button
                onClick={() => setFolderFilter("sent")}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                  folderFilter === "sent"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                )}
              >
                <Send className={cn("w-3.5 h-3.5")} />
                발송한 이미지 ({allFolderPhotos.filter(p => p.sentTo).length})
              </button>
            </div>

            {/* 사진 영역 */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              {/* 타이틀 & 뷰 모드 토글 */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">
                  {folderFilter === "all" ? "전체" :
                   folderFilter === "favorites" ? "즐겨찾기" :
                   folderFilter === "recent" ? "등록순" : "발송한 이미지"} ({folderPhotos.length})
                </h3>
                <div className="flex items-center bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-full transition-all",
                      viewMode === "list"
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("thumbnail")}
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-full transition-all",
                      viewMode === "thumbnail"
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {folderPhotos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center mb-4">
                    <Image className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {folderFilter === "favorites" ? "즐겨찾기한 사진이 없어요" :
                     folderFilter === "sent" ? "발송한 이미지가 없어요" :
                     "폴더에 사진이 없어요"}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-[280px]">
                    {folderFilter === "favorites"
                      ? "하트를 눌러 소중한 사진을 즐겨찾기에 추가해보세요"
                      : folderFilter === "sent"
                      ? "편지와 함께 사진을 보내보세요"
                      : "사진을 추가해서 소중한 추억을 보관하세요"}
                  </p>
                </div>
              ) : viewMode === "list" ? (
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {folderPhotos.map((photo, index) => (
                      <PhotoItem key={photo.id} photo={photo} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <AnimatePresence mode="popLayout">
                    {folderPhotos.map((photo, index) => (
                      <PhotoItem key={photo.id} photo={photo} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
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
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

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

                  {selectedPhoto.sentTo && (
                    <p className="text-green-400 text-sm flex items-center justify-center gap-2 mt-2">
                      <Check className="w-4 h-4" />
                      {selectedPhoto.sentTo}님에게 발송완료 ({selectedPhoto.sentDate})
                    </p>
                  )}

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

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center px-6">
        <h1 className="text-lg font-semibold text-foreground">갤러리</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-4 py-10 lg:px-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* 타이틀 */}
          <div className="mb-[18px]">
            <h2 className="text-2xl font-bold text-foreground mb-[18px]">
              소중한 <span className="text-primary underline underline-offset-4">추억</span>을 보관하세요
            </h2>
            <div className="mb-6">
              <p className="text-base text-muted-foreground leading-normal">
                편지 작성 시 갤러리에서 사진을 첨부할 수 있어요.
                <br />
                소중한 순간들을 이곳에 보관하고, 편지를 쓸 때 함께 전해보세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-[0_4px_14px_rgba(251,146,60,0.3)]">
                <Plus className="w-4 h-4" />
                사진 추가
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-gray-300"
                onClick={() => setShowFolderCreatePopup(true)}
              >
                <FolderPlus className="w-4 h-4" />
                폴더 생성
              </Button>
            </div>
          </div>

          {/* 폴더 영역 */}
          {folders.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">폴더</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {folders.map(folder => (
                  <FolderCard key={folder.id} folder={folder} />
                ))}
              </div>
            </div>
          )}

          {/* To. 수신자 버튼 */}
          <button className="w-full py-3 px-4 bg-orange-50 border border-orange-200 rounded-xl text-left hover:bg-orange-100 transition-colors">
            <span className="text-primary font-medium">To. 사랑하는 아버지께</span>
          </button>

          {/* 필터 탭 */}
          <div className="flex gap-2">
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
            <button
              onClick={() => setFilter("recent")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                filter === "recent"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              )}
            >
              <Clock className={cn("w-3.5 h-3.5")} />
              등록순
            </button>
            <button
              onClick={() => setFilter("sent")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                filter === "sent"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              )}
            >
              <Send className={cn("w-3.5 h-3.5")} />
              발송한 이미지 ({photos.filter(p => p.sentTo).length})
            </button>
          </div>

          {/* 전체 사진 영역 */}
          <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            {/* 전체 타이틀 & 뷰 모드 토글 */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {filter === "all" ? "전체" :
                 filter === "favorites" ? "즐겨찾기" :
                 filter === "recent" ? "등록순" : "발송한 이미지"} ({filter === "all" ? unclassifiedPhotos.length : filteredPhotos.length})
              </h3>
              {/* 뷰 모드 토글 */}
              <div className="flex items-center bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full transition-all",
                    viewMode === "list"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("thumbnail")}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full transition-all",
                    viewMode === "thumbnail"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {(filter === "all" ? unclassifiedPhotos : filteredPhotos).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center mb-4">
                  <Image className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {filter === "favorites" ? "즐겨찾기한 사진이 없어요" :
                   filter === "sent" ? "발송한 이미지가 없어요" :
                   "아직 추억이 없어요"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  {filter === "favorites"
                    ? "하트를 눌러 소중한 사진을 즐겨찾기에 추가해보세요"
                    : filter === "sent"
                    ? "편지와 함께 사진을 보내보세요"
                    : "기다림의 순간들을 사진으로 담아보세요. 편지와 함께 전할 수 있어요."}
                </p>
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {(filter === "all" ? unclassifiedPhotos : filteredPhotos).map((photo, index) => (
                    <PhotoItem key={photo.id} photo={photo} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <AnimatePresence mode="popLayout">
                  {(filter === "all" ? unclassifiedPhotos : filteredPhotos).map((photo, index) => (
                    <PhotoItem key={photo.id} photo={photo} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 폴더 생성 팝업 */}
      <AnimatePresence>
        {showFolderCreatePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
            onClick={() => setShowFolderCreatePopup(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">새 폴더 만들기</h3>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") createFolder();
                }}
                placeholder="폴더 이름을 입력하세요"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                autoFocus
              />
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowFolderCreatePopup(false);
                    setNewFolderName("");
                  }}
                >
                  취소
                </Button>
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  onClick={createFolder}
                  disabled={!newFolderName.trim()}
                >
                  만들기
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

                {/* 발송 정보 */}
                {selectedPhoto.sentTo && (
                  <p className="text-green-400 text-sm flex items-center justify-center gap-2 mt-2">
                    <Check className="w-4 h-4" />
                    {selectedPhoto.sentTo}님에게 발송완료 ({selectedPhoto.sentDate})
                  </p>
                )}

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

      {/* 클릭 외부 영역 클릭시 폴더 메뉴 닫기 */}
      {folderMenuOpen && (
        <div
          className="fixed inset-0 z-[5]"
          onClick={() => setFolderMenuOpen(null)}
        />
      )}
    </div>
  );
}
