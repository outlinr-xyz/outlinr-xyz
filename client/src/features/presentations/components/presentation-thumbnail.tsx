interface PresentationThumbnailProps {
  thumbnailUrl?: string | null;
  title: string;
  className?: string;
}

const PresentationThumbnail = ({
  thumbnailUrl,
  title,
  className = '',
}: PresentationThumbnailProps) => {
  return thumbnailUrl ? (
    <img
      src={thumbnailUrl}
      alt={title}
      loading="lazy"
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  ) : (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-100">
      <img
        src="/outlinr.webp"
        alt="outlinr logo"
        className="h-16 w-16 opacity-20 grayscale"
      />
    </div>
  );
};

export default PresentationThumbnail;
