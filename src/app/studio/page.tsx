"use client";

import { useState } from "react";
import { manifest, type PortfolioImage, formatBytes } from "@/lib/manifest";
import { SmartImage } from "@/components/SmartImage";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DotsSixVertical,
  FloppyDisk,
  LockKey,
  Check,
  Tag,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import Link from "next/link";

const THEME_OPTIONS = [
  { value: "Portrait", label: "Chân dung (Portrait)" },
  { value: "Group", label: "Nhóm / Đời thường (Group)" },
  { value: "Landscape", label: "Cảnh / Kiến trúc (Landscape)" },
  { value: "Moment", label: "Khoảnh khắc (Moment)" },
  { value: "Nocturne", label: "Đêm / Tương phản (Nocturne)" },
];

function SortableImageItem({
  img,
  index,
  onUpdateTitle,
  onUpdateCategory,
}: {
  img: PortfolioImage;
  index: number;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateCategory: (id: string, category: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: img.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[12px] border border-hairline bg-surface p-4 shadow-tinted"
    >
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab p-1.5 text-fg-subtle hover:text-accent active:cursor-grabbing"
          title="Kéo thả đổi vị trí"
        >
          <DotsSixVertical size={22} weight="bold" />
        </button>

        <span className="font-mono text-xs text-fg-subtle w-6">
          #{String(index + 1).padStart(2, "0")}
        </span>

        {/* Thumbnail */}
        <div className="size-16 shrink-0 overflow-hidden rounded-[8px] border border-hairline bg-bg-sunken">
          <SmartImage
            image={img}
            alt={img.customTitle || img.source.name}
            fallbackSeed={img.slug}
            fallbackWidth={120}
            fallbackHeight={120}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info & Rename */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <input
            type="text"
            value={img.customTitle || ""}
            placeholder={img.source.name}
            onChange={(e) => onUpdateTitle(img.id, e.target.value)}
            className="w-full sm:w-64 rounded-[6px] border border-hairline bg-bg-sunken px-2.5 py-1 text-sm font-medium text-fg focus:border-accent focus:outline-none"
          />
          <span className="font-mono text-[11px] text-fg-subtle truncate">
            {img.source.name} ({img.width}x{img.height}px - {formatBytes(img.bytes.webp)})
          </span>
        </div>
      </div>

      {/* Group / Category Selector */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div className="flex items-center gap-1.5">
          <Tag size={15} className="text-accent shrink-0" />
          <select
            value={img.category || "Moment"}
            onChange={(e) => onUpdateCategory(img.id, e.target.value)}
            className="rounded-[6px] border border-hairline bg-bg-sunken px-2 py-1 font-mono text-xs text-fg focus:border-accent focus:outline-none"
          >
            {THEME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [items, setItems] = useState<PortfolioImage[]>(manifest.images);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleUpdateTitle = (id: string, title: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, customTitle: title } : i))
    );
  };

  const handleUpdateCategory = (id: string, category: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, category } : i))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/curate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: items, pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi lưu dữ liệu");
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
        <div className="w-full max-w-md rounded-[16px] border border-hairline bg-surface p-8 shadow-tinted-lg text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent-soft text-accent mb-4">
            <LockKey size={24} weight="bold" />
          </div>
          <h1 className="text-xl font-medium text-fg">Studio Curation Access</h1>
          <p className="mt-2 text-xs text-fg-muted">
            Nhập mã PIN cá nhân để mở Studio curation.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pin.trim() === "1511") {
                setIsAuthenticated(true);
                setErrorMsg("");
              } else {
                setErrorMsg("Mã PIN không đúng");
              }
            }}
            className="mt-6 flex flex-col gap-3"
          >
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Nhập mã PIN"
              autoFocus
              className="w-full rounded-[8px] border border-hairline bg-bg-sunken px-4 py-2.5 text-center font-mono text-sm tracking-widest text-fg focus:border-accent focus:outline-none"
            />
            {errorMsg && <p className="text-xs text-rose-500">{errorMsg}</p>}
            <button
              type="submit"
              className="press w-full rounded-[8px] bg-accent py-2.5 text-sm font-medium text-accent-fg hover:bg-accent-hover"
            >
              Mở Studio
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top action bar */}
      <div className="sticky top-4 z-30 mb-8 flex items-center justify-between gap-4 rounded-[14px] border border-hairline bg-surface/90 backdrop-blur-md p-4 shadow-tinted-lg">
        <div>
          <h1 className="text-lg font-medium text-fg">Curation Studio</h1>
          <p className="text-xs text-fg-muted">
            Kéo thả biểu tượng 6 chấm để đổi thứ tự, gõ để đổi tên tác phẩm, chọn thể loại.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="press hidden sm:inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-4 py-2 text-xs font-mono text-fg-muted hover:text-fg"
          >
            <span>Xem trang chính</span>
            <ArrowSquareOut size={14} />
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="press inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover shadow-tinted disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <Check size={16} weight="bold" className="text-white" />
                <span>Đã lưu!</span>
              </>
            ) : (
              <>
                <FloppyDisk size={16} weight="bold" />
                <span>{saving ? "Đang lưu..." : "Lưu thay đổi"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-[8px] border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-500">
          {errorMsg}
        </div>
      )}

      {/* Sortable drag and drop list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((img, idx) => (
              <SortableImageItem
                key={img.id}
                img={img}
                index={idx}
                onUpdateTitle={handleUpdateTitle}
                onUpdateCategory={handleUpdateCategory}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
