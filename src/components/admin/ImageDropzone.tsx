import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { fileToDataUrl, uploadMedia } from '../../lib/utils';
import styles from '../../styles/admin.module.css';

type UploadItem = {
  id: string;
  preview: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
};

type BaseProps = {
  label: string;
  folder: string;
  disabled?: boolean;
};

type SingleProps = BaseProps & {
  multiple?: false;
  value: string;
  onChange: (url: string) => void;
};

type MultipleProps = BaseProps & {
  multiple: true;
  values: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  heroUrl?: string;
  onSetHero?: (url: string) => void;
};

export type ImageDropzoneProps = SingleProps | MultipleProps;

function isImageFile(file: File) {
  return file.type.startsWith('image/');
}

export function ImageDropzone(props: ImageDropzoneProps) {
  const { label, folder, disabled } = props;
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
    const preview = URL.createObjectURL(file);

    setUploads((prev) => [...prev, { id, preview, progress: 0, status: 'uploading' }]);

    try {
      const url = await uploadMedia(file, folder, (progress) => {
        updateUpload(id, { progress });
      });
      updateUpload(id, { progress: 100, status: 'done' });
      removeUpload(id, preview);

      if (props.multiple === true) {
        props.onChange((prev) => [...prev, url]);
      } else {
        props.onChange(url);
      }
    } catch {
      try {
        const url = await fileToDataUrl(file);
        updateUpload(id, { progress: 100, status: 'done' });
        removeUpload(id, preview);

        if (props.multiple === true) {
          props.onChange((prev) => [...prev, url]);
        } else {
          props.onChange(url);
        }
      } catch {
        updateUpload(id, { status: 'error' });
      }
    }
  }, [folder, props, removeUpload, updateUpload]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter(isImageFile);
    if (!imageFiles.length) return;

    if (props.multiple === true) {
      void Promise.all(imageFiles.map((file) => uploadFile(file)));
    } else {
      void uploadFile(imageFiles[0]);
    }
  }, [props.multiple, uploadFile]);

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

  const removeUrl = (index: number) => {
    if (props.multiple !== true) return;
    props.onChange((prev) => prev.filter((_, i) => i !== index));
  };

  const isUploading = uploads.some((u) => u.status === 'uploading');
  const zoneDisabled = disabled || isUploading;

  useEffect(() => {
    return () => {
      uploads.forEach((item) => {
        if (item.preview.startsWith('blob:')) URL.revokeObjectURL(item.preview);
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const existingUrls = props.multiple === true
    ? props.values
    : props.value
      ? [props.value]
      : [];
  const showHeroActions = props.multiple === true && props.onSetHero;

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
          accept="image/*"
          multiple={props.multiple}
          onChange={onInputChange}
          disabled={zoneDisabled}
          className={styles.dropzoneInput}
        />
        <div className={styles.dropzoneContent}>
          <span className={styles.dropzoneIcon}>↑</span>
          <p className={styles.dropzoneText}>
            {isUploading ? 'Uploading…' : 'Drag images here or click to browse'}
          </p>
          <p className={styles.dropzoneHint}>
            {props.multiple === true ? 'PNG, JPG, WebP — multiple files supported' : 'PNG, JPG, WebP'}
          </p>
        </div>
      </div>

      {(existingUrls.length > 0 || uploads.length > 0) && (
        <div className={`${styles.thumbGrid} ${props.multiple === true ? '' : styles.thumbGridHero}`}>
          {existingUrls.map((url, i) => (
            <div key={`${url}-${i}`} className={styles.thumb}>
              <img src={url} alt="" />
              {showHeroActions && (
                <button
                  type="button"
                  className={`${styles.thumbAction} ${props.heroUrl === url ? styles.thumbActionActive : ''}`}
                  onClick={(e) => { e.stopPropagation(); props.onSetHero?.(url); }}
                >
                  {props.heroUrl === url ? 'Hero ✓' : 'Hero'}
                </button>
              )}
              {props.multiple === true && (
                <button
                  type="button"
                  className={styles.thumbRemove}
                  aria-label="Remove image"
                  onClick={(e) => { e.stopPropagation(); removeUrl(i); }}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {uploads.map((item) => (
            <div key={item.id} className={`${styles.thumb} ${item.status === 'error' ? styles.thumbError : ''}`}>
              <img src={item.preview} alt="" />
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
