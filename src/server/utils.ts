import logger from './logger';

const OFFICE_DOC_CONTENT_TYPE = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
} as const;

export function createFileResponse(
  body: Uint8Array,
  contentType: keyof typeof OFFICE_DOC_CONTENT_TYPE,
  filename: string,
) {
  return new Response(body, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename=${filename}`,
    },
  });
}

export function logPerfTime(task: string, start: number): void {
  logger.info(`${task}: ${performance.now() - start} ms`);
}
