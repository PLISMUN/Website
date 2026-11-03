import { NextApiRequest, NextApiResponse } from 'next';
import { handleUpload } from '@vercel/blob/client';
import { getTursoClient } from '@/pages/api/components/dbAuth';
import authAdmin from '@/pages/api/internal/authAdmin';
import preFlightChecks from '@/pages/api/internal/preFlightChecks';
import { DOCUMENT_MAX_SIZE_MB } from '@/config/documents';

const ONE_HOUR_IN_SECONDS = 60 * 60;

/**
 * Hands the upload() call in the browser a token to send a document straight to Vercel Blob.
 * The file can't come through here, as Vercel limits function request bodies to 4.5 MB.
 *
 * There's deliberately no onUploadCompleted: that webhook can't reach localhost or a preview
 * behind Deployment Protection. The browser calls /api/modify/setDocument after uploading instead.
 *
 * @param {NextApiRequest[HandleUploadBody]} req.body Sent by upload() from @vercel/blob/client
 * @returns {NextApiResponse} res.status(200).json({ type: 'blob.generate-client-token', clientToken: <string> })
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await preFlightChecks(req, res);
  if (res.headersSent) return;
  await authAdmin(req, res, false);
  if (res.headersSent) return;

  try {
    const result = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        const existing = await getTursoClient().execute({
          sql: 'SELECT id FROM documents WHERE path = ?',
          args: [pathname],
        });
        if (!existing.rows.length) {
          throw new Error('Unknown document');
        }
        return {
          allowedContentTypes: ['application/pdf'],
          maximumSizeInBytes: DOCUMENT_MAX_SIZE_MB * 1024 * 1024,
          // Replacing a document keeps its URL, so links that were already shared keep working
          addRandomSuffix: false,
          allowOverwrite: true,
          // The default of a month would leave browsers holding on to a replaced document
          cacheControlMaxAge: ONE_HOUR_IN_SECONDS,
        };
      },
    });

    res.status(200).json(result);
  } catch (err: any) {
    console.error('Error creating document upload token:', err);
    res.status(400).json({ message: err.message || 'Something went wrong' });
  }
}
