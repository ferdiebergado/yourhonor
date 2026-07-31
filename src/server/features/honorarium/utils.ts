import type { IPatch } from 'docx';
import { patchDocument, PatchType, TextRun } from 'docx';
import { ToWords } from 'to-words';

import logger from '@server/logger';

const OFFICE_DOC_CONTENT_TYPE = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
} as const;

const wordConverter = new ToWords({ localeCode: 'en-PH' });

export async function amountToWords(amount: number): Promise<string> {
  return wordConverter.convert(amount, {
    currency: true,
    doNotAddOnly: true,
  });
}

export async function patchDoc(template: string, tags: Record<string, string>) {
  try {
    const data = Buffer.from(template, 'base64');

    const patches: Record<string, IPatch> = {};
    for (const [tag, text] of Object.entries(tags)) {
      patches[tag] = {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(text)],
      };
    }

    const doc = await patchDocument({
      outputType: 'nodebuffer',
      data,
      patches,
    });

    return doc;
  } catch (error) {
    const msg = 'Failed to patch document.';
    logger.error(error, msg);
    throw new Error(msg, { cause: error });
  }
}

export const createFileResponse = (
  body: Uint8Array,
  contentType: keyof typeof OFFICE_DOC_CONTENT_TYPE,
  filename: string,
) =>
  new Response(body, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename=${filename}`,
    },
  });

const MFO_CODES = {
  BEC: '310100100003000',
  ELLN: '310100100007000',
  FLO: '310300100003000',
} as const;

type Appropriation = 'Current' | 'Continuing';
type Program = keyof typeof MFO_CODES;

export type FundCluster = {
  year: number;
  appropriation: Appropriation;
  program: Program;
  mfoCode: (typeof MFO_CODES)[Program];
};

export function parseActivityCode(activityCode: string): FundCluster {
  const [_, year, _bureau, _division, pap, code] = activityCode.split('-');

  if (!Object.keys(MFO_CODES).includes(pap))
    throw new Error('Invalid MFO Program');

  const program = pap as Program;
  const mfoCode = MFO_CODES[program];
  const appropriation: Appropriation = code.startsWith('P')
    ? 'Continuing'
    : 'Current';
  return {
    year: Number.parseInt(year) + 2000,
    appropriation,
    program,
    mfoCode,
  };
}

export function getFundCluster(activityCode: string): string {
  const { year, appropriation, program } = parseActivityCode(activityCode);

  return `${year.toString()} ${program} ${appropriation}`;
}
