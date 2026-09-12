import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import multer from 'multer';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import ILovePDFFile from '@ilovepdf/ilovepdf-nodejs/ILovePDFFile.js';

// Load environment variables
dotenv.config();

// Ensure temporary upload directory exists
const UPLOAD_DIR = path.join(os.tmpdir(), 'pdf_tools_pro_uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer for secure temporary storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeExt = path.extname(file.originalname).toLowerCase();
    cb(null, `upload-${uniqueSuffix}${safeExt}`);
  },
});

// Max 50MB per file, up to 10 files
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10,
  },
});

// List of all 23 tools and their API capability status
export const TOOLS_CONFIG: Record<string, {
  name: string;
  apiTool?: string;
  supportedByApi: boolean;
  unsupportedReason?: string;
  acceptedExtensions: string[];
  maxFiles: number;
  minFiles: number;
  outputExt: string;
  outputContentType: string;
}> = {
  'merge': {
    name: 'Merge PDF',
    apiTool: 'merge',
    supportedByApi: true,
    acceptedExtensions: ['.pdf'],
    minFiles: 2,
    maxFiles: 10,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'split': {
    name: 'Split PDF',
    apiTool: 'split',
    supportedByApi: true,
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputExt: 'zip',
    outputContentType: 'application/zip',
  },
  'compress': {
    name: 'Compress PDF',
    apiTool: 'compress',
    supportedByApi: true,
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 5,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'pdf-to-word': {
    name: 'PDF to Word',
    supportedByApi: false,
    unsupportedReason: 'The iLovePDF developer REST API does not provide a PDF to Word export endpoint. Only Office-to-PDF conversion is supported in the public API. Fake conversions are strictly disabled.',
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputExt: 'docx',
    outputContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  'pdf-to-excel': {
    name: 'PDF to Excel',
    supportedByApi: false,
    unsupportedReason: 'The iLovePDF developer REST API does not provide a PDF to Excel export endpoint. Only Office-to-PDF conversion is supported in the public API. Fake conversions are strictly disabled.',
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputExt: 'xlsx',
    outputContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  'pdf-to-powerpoint': {
    name: 'PDF to PowerPoint',
    supportedByApi: false,
    unsupportedReason: 'The iLovePDF developer REST API does not provide a PDF to PowerPoint export endpoint. Only Office-to-PDF conversion is supported in the public API. Fake conversions are strictly disabled.',
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputExt: 'pptx',
    outputContentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  },
  'word-to-pdf': {
    name: 'Word to PDF',
    apiTool: 'officepdf',
    supportedByApi: true,
    acceptedExtensions: ['.doc', '.docx'],
    minFiles: 1,
    maxFiles: 5,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'excel-to-pdf': {
    name: 'Excel to PDF',
    apiTool: 'officepdf',
    supportedByApi: true,
    acceptedExtensions: ['.xls', '.xlsx'],
    minFiles: 1,
    maxFiles: 5,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'powerpoint-to-pdf': {
    name: 'PowerPoint to PDF',
    apiTool: 'officepdf',
    supportedByApi: true,
    acceptedExtensions: ['.ppt', '.pptx'],
    minFiles: 1,
    maxFiles: 5,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'jpg-to-pdf': {
    name: 'JPG to PDF',
    apiTool: 'imagepdf',
    supportedByApi: true,
    acceptedExtensions: ['.jpg', '.jpeg'],
    minFiles: 1,
    maxFiles: 10,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'pdf-to-jpg': {
    name: 'PDF to JPG',
    apiTool: 'pdfjpg',
    supportedByApi: true,
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputExt: 'zip',
    outputContentType: 'application/zip',
  },
  'png-to-pdf': {
    name: 'PNG to PDF',
    apiTool: 'imagepdf',
    supportedByApi: true,
    acceptedExtensions: ['.png'],
    minFiles: 1,
    maxFiles: 10,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'rotate': {
    name: 'Rotate PDF',
    apiTool: 'rotate',
    supportedByApi: true,
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 5,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'watermark': {
    name: 'Watermark PDF',
    apiTool: 'watermark',
    supportedByApi: true,
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'page-numbers': {
    name: 'Page Numbers',
    apiTool: 'pagenumber',
    supportedByApi: true,
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'unlock': {
    name: 'Unlock PDF',
    apiTool: 'unlock',
    supportedByApi: true,
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'protect': {
    name: 'Protect PDF',
    apiTool: 'protect',
    supportedByApi: true,
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'pdf-ocr': {
    name: 'PDF OCR',
    apiTool: 'pdfocr',
    supportedByApi: true,
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'html-to-pdf': {
    name: 'HTML to PDF',
    apiTool: 'htmlpdf',
    supportedByApi: true,
    acceptedExtensions: ['.html', '.htm'],
    minFiles: 0, // Can use URL
    maxFiles: 1,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'repair': {
    name: 'PDF Repair',
    apiTool: 'repair',
    supportedByApi: true,
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'pdf-metadata': {
    name: 'PDF Metadata',
    supportedByApi: false,
    unsupportedReason: 'The iLovePDF developer REST API does not expose a standalone PDF Metadata tool. Fake results are strictly disabled.',
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'organize-pdf': {
    name: 'Organize PDF Pages',
    supportedByApi: false,
    unsupportedReason: 'The iLovePDF developer REST API does not provide a visual page organizer endpoint. You can use the Split PDF tool to extract or remove specific page ranges.',
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputExt: 'pdf',
    outputContentType: 'application/pdf',
  },
  'extract-pdf': {
    name: 'Extract PDF Pages',
    apiTool: 'extract',
    supportedByApi: true,
    acceptedExtensions: ['.pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputExt: 'txt',
    outputContentType: 'text/plain',
  },
};

// Clean up temporary files helper
async function cleanupFiles(files: Express.Multer.File[]) {
  for (const file of files) {
    try {
      if (fs.existsSync(file.path)) {
        await fs.promises.unlink(file.path);
      }
    } catch (err) {
      console.error(`Failed to delete temporary file ${file.path}:`, err);
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'PDF Tools Pro Backend',
      timestamp: new Date().toISOString(),
    });
  });

  // Server API configuration status (NEVER exposes secret key!)
  app.get('/api/status', (_req: Request, res: Response) => {
    const publicKey = process.env.ILOVEPDF_PUBLIC_KEY?.trim() || '';
    const secretKey = process.env.ILOVEPDF_SECRET_KEY?.trim() || '';

    const hasPublicKey = Boolean(publicKey && !publicKey.includes('MY_KEY') && publicKey.length > 5);
    const hasSecretKey = Boolean(secretKey && !secretKey.includes('MY_KEY') && secretKey.length > 5);

    res.json({
      configured: hasPublicKey && hasSecretKey,
      publicKeyConfigured: hasPublicKey,
      secretKeyConfigured: hasSecretKey,
      missing: [
        ...(!hasPublicKey ? ['ILOVEPDF_PUBLIC_KEY'] : []),
        ...(!hasSecretKey ? ['ILOVEPDF_SECRET_KEY'] : []),
      ],
      notice: 'API keys are stored securely server-side only and never transmitted to the browser.',
    });
  });

  // Tools listing endpoint
  app.get('/api/tools-config', (_req: Request, res: Response) => {
    res.json(TOOLS_CONFIG);
  });

  // PDF processing endpoint
  app.post(
    '/api/process/:toolId',
    upload.array('files'),
    async (req: Request, res: Response) => {
      const toolId = req.params.toolId;
      const uploadedFiles = (req.files as Express.Multer.File[]) || [];
      const tool = TOOLS_CONFIG[toolId];

      if (!tool) {
        await cleanupFiles(uploadedFiles);
        res.status(404).json({
          error: 'Tool not found',
          message: `The tool '${toolId}' is not recognized.`,
        });
        return;
      }

      // Strict requirement: Only enable tools that are actually supported by the iLovePDF API
      if (!tool.supportedByApi) {
        await cleanupFiles(uploadedFiles);
        res.status(400).json({
          error: 'API not available for this tool',
          tool: tool.name,
          message: tool.unsupportedReason || 'This operation is not supported by the iLovePDF developer REST API. Fake operations are strictly disabled.',
        });
        return;
      }

      // Credentials verification
      const publicKey = process.env.ILOVEPDF_PUBLIC_KEY?.trim();
      const secretKey = process.env.ILOVEPDF_SECRET_KEY?.trim();

      if (!publicKey || !secretKey || publicKey.includes('MY_KEY') || secretKey.includes('MY_KEY')) {
        await cleanupFiles(uploadedFiles);
        res.status(400).json({
          error: 'iLovePDF API credentials not configured on the server',
          code: 'CREDENTIALS_MISSING',
          message:
            'The server requires ILOVEPDF_PUBLIC_KEY and ILOVEPDF_SECRET_KEY to be configured in the backend environment. Please set these in your Render or .env environment settings to process documents.',
          setupGuideUrl: 'https://developer.ilovepdf.com/',
        });
        return;
      }

      // Input validation: HTML to PDF can use url instead of files
      const urlParam = (req.body.url as string)?.trim();
      if (toolId === 'html-to-pdf' && !uploadedFiles.length && !urlParam) {
        await cleanupFiles(uploadedFiles);
        res.status(400).json({
          error: 'Missing input',
          message: 'Please provide either an HTML file or a valid URL (starting with http:// or https://) to convert to PDF.',
        });
        return;
      }

      // File count validation
      if (toolId !== 'html-to-pdf' && uploadedFiles.length < tool.minFiles) {
        await cleanupFiles(uploadedFiles);
        res.status(400).json({
          error: 'Insufficient files',
          message: `${tool.name} requires at least ${tool.minFiles} file(s). You provided ${uploadedFiles.length}.`,
        });
        return;
      }

      if (uploadedFiles.length > tool.maxFiles) {
        await cleanupFiles(uploadedFiles);
        res.status(400).json({
          error: 'Too many files',
          message: `${tool.name} allows a maximum of ${tool.maxFiles} file(s). You provided ${uploadedFiles.length}.`,
        });
        return;
      }

      // File extension validation
      for (const file of uploadedFiles) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!tool.acceptedExtensions.includes(ext)) {
          await cleanupFiles(uploadedFiles);
          res.status(400).json({
            error: 'Invalid file type',
            message: `File '${file.originalname}' has an invalid format (${ext}). Supported formats: ${tool.acceptedExtensions.join(', ')}.`,
          });
          return;
        }
      }

      // Process with iLovePDF API
      try {
        const api = new ILovePDFApi(publicKey, secretKey);
        const taskType = tool.apiTool as any;
        const task = api.newTask(taskType);

        // Start task on iLovePDF cluster
        await task.start();

        // Add files or URL
        if (toolId === 'html-to-pdf' && urlParam) {
          await task.addFile(urlParam);
        } else {
          for (const file of uploadedFiles) {
            let fileParams: any = undefined;
            if (toolId === 'rotate') {
              const rotation = parseInt(req.body.rotate || '90', 10);
              fileParams = { rotate: rotation };
            }
            if (req.body.filePassword) {
              fileParams = { ...(fileParams || {}), password: req.body.filePassword };
            }

            const iloveFile = new ILovePDFFile(file.path, fileParams);
            await task.addFile(iloveFile);
          }
        }

        // Build process parameters based on tool options
        const processParams: Record<string, any> = {};

        if (toolId === 'compress') {
          const level = req.body.compression_level || 'recommended';
          processParams.compression_level = level;
        } else if (toolId === 'split') {
          const splitMode = req.body.split_mode || 'ranges';
          processParams.split_mode = splitMode;
          if (splitMode === 'ranges' && req.body.ranges) {
            processParams.ranges = req.body.ranges;
          } else if (splitMode === 'fixed_range') {
            processParams.fixed_range = parseInt(req.body.fixed_range || '1', 10);
          } else if (splitMode === 'remove_pages' && req.body.remove_pages) {
            processParams.remove_pages = req.body.remove_pages;
          }
          if (req.body.merge_after === 'true' || req.body.merge_after === true) {
            processParams.merge_after = true;
          }
        } else if (toolId === 'watermark') {
          processParams.mode = 'text';
          processParams.text = req.body.text || 'CONFIDENTIAL';
          processParams.vertical_position = req.body.vertical_position || 'middle';
          processParams.horizontal_position = req.body.horizontal_position || 'center';
          if (req.body.font_size) processParams.font_size = parseInt(req.body.font_size, 10);
          if (req.body.font_family) processParams.font_family = req.body.font_family;
          if (req.body.font_color) processParams.font_color = req.body.font_color;
          if (req.body.rotation) processParams.rotation = parseInt(req.body.rotation, 10);
          if (req.body.transparency) processParams.transparency = parseInt(req.body.transparency, 10);
        } else if (toolId === 'page-numbers') {
          processParams.vertical_position = req.body.vertical_position || 'bottom';
          processParams.horizontal_position = req.body.horizontal_position || 'right';
          if (req.body.starting_number) processParams.starting_number = parseInt(req.body.starting_number, 10);
          if (req.body.pages) processParams.pages = req.body.pages;
        } else if (toolId === 'protect') {
          if (!req.body.password) {
            await cleanupFiles(uploadedFiles);
            res.status(400).json({
              error: 'Missing password',
              message: 'Protect PDF requires a password parameter.',
            });
            return;
          }
          processParams.password = req.body.password;
        } else if (toolId === 'pdf-ocr') {
          const lang = req.body.ocr_language || 'eng';
          processParams.ocr_languages = [lang];
        } else if (toolId === 'jpg-to-pdf' || toolId === 'png-to-pdf') {
          processParams.orientation = req.body.orientation || 'portrait';
          processParams.margin = parseInt(req.body.margin || '0', 10);
          processParams.pagesize = req.body.pagesize || 'fit';
        } else if (toolId === 'pdf-to-jpg') {
          processParams.pdfjpg_mode = req.body.pdfjpg_mode || 'pages';
          if (req.body.dpi) processParams.dpi = parseInt(req.body.dpi, 10);
        } else if (toolId === 'html-to-pdf') {
          processParams.page_orientation = req.body.page_orientation || 'portrait';
          processParams.page_size = req.body.page_size || 'A4';
          processParams.view_width = 1280;
          processParams.view_height = 800;
        } else if (toolId === 'extract-pdf') {
          processParams.detailed = req.body.detailed === 'true' || req.body.detailed === true;
        }

        // Execute task
        await task.process(processParams);

        // Download processed result buffer
        const downloadedData = await task.download();
        const buffer = Buffer.from(downloadedData);

        // Determine filename
        const originalBase = uploadedFiles.length
          ? path.parse(uploadedFiles[0].originalname).name
          : 'converted';
        const resultFilename = `PDFToolsPro_${toolId}_${originalBase}.${tool.outputExt}`;

        res.setHeader('Content-Type', tool.outputContentType);
        res.setHeader('Content-Disposition', `attachment; filename="${resultFilename}"`);
        res.setHeader('Content-Length', buffer.length.toString());
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

        res.send(buffer);
      } catch (error: any) {
        console.error(`iLovePDF processing error for ${toolId}:`, error);

        // Extract clean error message
        let errorMessage = 'An unexpected error occurred during document processing.';
        if (error?.message) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        res.status(500).json({
          error: 'Processing failed',
          message: errorMessage,
          tool: tool.name,
        });
      } finally {
        // Securely delete temporary files after processing
        await cleanupFiles(uploadedFiles);
      }
    }
  );

  // Global error handler for multer and express
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Server error handler caught:', err);
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({
          error: 'File too large',
          message: 'File size exceeds the 50MB limit per file.',
        });
        return;
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        res.status(400).json({
          error: 'Too many files',
          message: 'The maximum allowed number of files is 10.',
        });
        return;
      }
    }
    res.status(500).json({
      error: 'Server error',
      message: err.message || 'Internal server error occurred.',
    });
  });

  // Vite development middleware or production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PDF Tools Pro] Server running on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[PDF Tools Pro] Failed to start server:', err);
  process.exit(1);
});
