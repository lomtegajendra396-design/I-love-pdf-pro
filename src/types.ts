export type ToolCategory =
  | 'all'
  | 'popular'
  | 'organize'
  | 'optimize'
  | 'convert-to-pdf'
  | 'convert-from-pdf'
  | 'security'
  | 'edit';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  isPopular?: boolean;
  iconName: string;
  supportedByApi: boolean;
  unsupportedReason?: string;
  acceptedExtensions: string[];
  acceptedMimeTypes?: string;
  minFiles: number;
  maxFiles: number;
  outputExt: string;
  outputContentType: string;
  tagline: string;
  features: string[];
}

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  formattedSize: string;
  previewUrl?: string;
  rotation?: number;
}

export interface ApiStatus {
  configured: boolean;
  publicKeyConfigured: boolean;
  secretKeyConfigured: boolean;
  missing?: string[];
  notice?: string;
}

export interface ToolOptions {
  // Compress
  compression_level?: 'recommended' | 'extreme' | 'low';
  // Split
  split_mode?: 'ranges' | 'fixed_range' | 'remove_pages';
  ranges?: string;
  fixed_range?: number;
  remove_pages?: string;
  merge_after?: boolean;
  // Rotate
  rotate?: 90 | 180 | 270;
  // Watermark
  watermark_text?: string;
  vertical_position?: 'top' | 'middle' | 'bottom';
  horizontal_position?: 'left' | 'center' | 'right';
  font_size?: number;
  font_family?: string;
  font_color?: string;
  watermark_rotation?: number;
  transparency?: number;
  // Page numbers
  page_position?: 'bottom-right' | 'bottom-center' | 'bottom-left' | 'top-right' | 'top-center' | 'top-left';
  starting_number?: number;
  page_format?: string;
  // Protect
  password?: string;
  confirmPassword?: string;
  // Unlock
  filePassword?: string;
  // OCR
  ocr_language?: string;
  // Image to PDF
  orientation?: 'portrait' | 'landscape';
  margin?: number;
  pagesize?: 'fit' | 'A4' | 'letter';
  // PDF to JPG
  pdfjpg_mode?: 'pages' | 'extract';
  dpi?: number;
  // HTML to PDF
  html_url?: string;
  page_size?: 'A4' | 'Letter' | 'A3';
  // Extract
  detailed?: boolean;
}
