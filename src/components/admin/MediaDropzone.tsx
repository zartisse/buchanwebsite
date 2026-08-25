import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { compressImageForUpload } from '../../lib/imageCompress';
import { fileToDataUrl, isVideoUrl, uploadMedia } from '../../lib/utils';
import styles from '../../styles/admin.module.css';

type UploadItem = {
  id: string;
  preview: string;
  isVideo: boolean;
  progress: number;
  status: 'uploading' | 'done' | 'error';
};

type MediaKind = 'image' | 'video' | 'both';

type MediaDropzoneProps = {
  label: string;
  folder: string;
  value: string;
  onChange: (url: string) => void;
  accept?: MediaKind;
  disabled?: boolean;
};

const ACCEPT_MAP: Record<MediaKind, string> = {
  image: 'image/*',
  video: 'video/mp4,video/webm,video/quicktime',
  both: 'image/*,video/mp4,video/webm,video/quicktime',
};

const HINT_MAP: Record<MediaKind, string> = {
  image: 'PNG, JPG, WebP',
  video: 'MP4, WebM, MOV',
  both: 'Images or video (MP4, WebM, MOV)',
};

function isAcceptedFile(file: File, kind: MediaKind) {
  if (kind === 'image') return file.type.startsWith('image/');
  if (kind === 'video') return file.type.startsWith('video/');
  return file.type.startsWith('image/') || file.type.startsWith('video/');
}

function MediaPreview({ url }: { url: string }) {
  if (isVideoUrl(url)) {
    return <video src={url} muted playsInline preload="metadata" />;
  }
  return <img src={url} alt="" />;
}

export function MediaDropzone({
  label,
  folder,
  value,
  onChange,
  accept = 'both',
  disabled,
}: MediaDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const dragCounter = useRef(0);

  const updateUpload = useCallback((id: string, patch: Partial<UploadItem>) => {
    setUploads((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const removeUpload = useCallback((id: string, preview?: string) => {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setUploads((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    const id = crypto.randomUUID();
    const isVideo = file.type.startsWith('video/');
    const uploadTarget = isVideo ? file : await compressImageForUpload(file, folder);
    const preview = URL.createObjectURL(uploadTarget);

    setUploads((prev) => [...prev, { id, preview, isVideo, progress: 0, status: 'uploading' }]);

    try {
      const url = await uploadMedia(uploadTarget, folder, (progress) => {
        updateUpload(id, { progress });
      });
      updateUpload(id, { progress: 100, status: 'done' });
      removeUpload(id, preview);
      onChange(url);
    } catch {
      try {
        const url = await fileToDataUrl(uploadTarget);
        updateUpload(id, { progress: 100, status: 'done' });
        removeUpload(id, preview);
        onChange(url);
      } catch {
        updateUpload(id, { status: 'error' });
      }
    }
  }, [folder, onChange, removeUpload, updateUpload]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const accepted = Array.from(files).filter((file) => isAcceptedFile(file, accept));
    if (!accepted.length) return;
    void uploadFile(accepted[0]);
  }, [accept, uploadFile]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(e.target.files);
    e.target.value = '';
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragging(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const isUploading = uploads.some((u) => u.status === 'uploading');
  const zoneDisabled = disabled || isUploading;
  const existingUrls = value ? [value] : [];

  useEffect(() => {
    return () => {
      uploads.forEach((item) => {
        if (item.preview.startsWith('blob:')) URL.revokeObjectURL(item.preview);
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>{label}</label>

      <div
        className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''} ${zoneDisabled ? styles.dropzoneDisabled : ''}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => !zoneDisabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !zoneDisabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={zoneDisabled ? -1 : 0}
        aria-disabled={zoneDisabled}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPT_MAP[accept]}
          onChange={onInputChange}
          disabled={zoneDisabled}
          className={styles.dropzoneInput}
        />
        <div className={styles.dropzoneContent}>
          <span className={styles.dropzoneIcon}>↑</span>
          <p className={styles.dropzoneText}>
            {isUploading ? 'Uploading…' : 'Drag media here or click to browse'}
          </p>
          <p className={styles.dropzoneHint}>{HINT_MAP[accept]}</p>
        </div>
      </div>

      {(existingUrls.length > 0 || uploads.length > 0) && (
        <div className={`${styles.thumbGrid} ${styles.thumbGridHero}`}>
          {existingUrls.map((url, i) => (
            <div key={`${url}-${i}`} className={styles.thumb}>
              <MediaPreview url={url} />
              <button
                type="button"
                className={styles.thumbRemove}
                aria-label="Remove media"
                onClick={(e) => { e.stopPropagation(); onChange(''); }}
              >
                ×
              </button>
            </div>
          ))}

          {uploads.map((item) => (
            <div key={item.id} className={`${styles.thumb} ${item.status === 'error' ? styles.thumbError : ''}`}>
              {item.isVideo ? (
                <video src={item.preview} muted playsInline />
              ) : (
                <img src={item.preview} alt="" />
              )}
              {item.status === 'uploading' && (
                <div className={styles.thumbOverlay}>
                  <span className={styles.thumbProgressText}>{item.progress}%</span>
                  <div className={styles.thumbProgressBar}>
                    <div className={styles.thumbProgressFill} style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              )}
              {item.status === 'error' && (
                <div className={styles.thumbOverlay}>
                  <span className={styles.thumbProgressText}>Failed</span>
                  <button
                    type="button"
                    className={styles.thumbRemove}
                    aria-label="Dismiss"
                    onClick={(e) => { e.stopPropagation(); removeUpload(item.id, item.preview); }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
