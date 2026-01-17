interface OrangeTreeContentProps {
  onClose: () => void;
  onCompose?: () => void;
}

export function OrangeTreeContent({ onClose }: OrangeTreeContentProps) {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      {/* Header - 다른 화면과 동일한 스타일 */}
      <header className="h-14 border-b border-border/40 bg-white flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-foreground">오렌지 나무</h1>
        <button
          onClick={onClose}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          편지함
        </button>
      </header>

      {/* Content - 이미지로 채움 */}
      <div className="flex-1 overflow-auto">
        <img
          src="/orange-tree-first.png"
          alt="오렌지 나무"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
