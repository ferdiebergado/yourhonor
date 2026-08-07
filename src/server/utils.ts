import { getFullName } from '@shared/utils';

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

export function formatName({
  firstname,
  mi,
  lastname,
}: {
  firstname: string;
  mi?: string | null;
  lastname: string;
}) {
  return getFullName({
    firstname,
    mi,
    lastname,
  }).toLocaleUpperCase();
}
