type HomeMediaSlotProps = {
  slotId: string;
  label: string;
  kind?: "image" | "video" | "image-or-video";
  cmsField?: string;
  className?: string;
  src?: string;
};

export default function HomeMediaSlot({ slotId, label, kind = "image-or-video", cmsField, className = "", src }: HomeMediaSlotProps) {
  const isVideo = Boolean(src && /\.(mp4|mov|webm)(?:\?|$)/i.test(src));
  const mediaClassName = ["cms-media-slot", src ? "is-bound" : "is-reserved", className].filter(Boolean).join(" ");

  return (
    <div
      className={mediaClassName}
      data-cms-media-slot={slotId}
      data-cms-media-kind={kind}
      data-cms-media-provider={src?.includes('/uploads/') ? "apostrophe" : src ? "original-static" : "cms"}
      data-cms-media-field={cmsField ?? slotId}
      data-cms-media-state={src ? "bound" : "reserved"}
      aria-label={`${label} CMS 媒体插口`}
    >
      {src && isVideo ? (
        <video className="cms-media-slot-media" autoPlay loop muted playsInline preload="metadata" aria-label={label}>
          <source src={src} />
        </video>
      ) : src ? (
        <img className="cms-media-slot-media" src={src} alt={label} loading="lazy" />
      ) : (
        <>
          <div className="cms-media-slot-signal" aria-hidden="true"><i /><i /><i /></div>
          <span>MEDIA SLOT / CMS</span>
          <strong>{slotId.split("/").pop()?.slice(-2).toUpperCase() ?? "00"}</strong>
          <small>{kind === "video" ? "预留视频字段" : kind === "image" ? "预留图片字段" : "预留图片 / 视频字段"}</small>
        </>
      )}
    </div>
  );
}
