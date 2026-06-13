import type { IPatch } from 'docx';

import logger from '@server/logger';

export async function amountToWords(amount: number): Promise<string> {
  const { ToWords } = await import('to-words');

  return new ToWords({ localeCode: 'en-PH' }).convert(amount, {
    currency: true,
    doNotAddOnly: true,
  });
}

export async function patchDoc(template: string, tags: Record<string, string>) {
  try {
    const { patchDocument, TextRun, PatchType } = await import('docx');

    const data = Buffer.from(template, 'base64');

    const patches = Object.fromEntries(
      Object.entries(tags).map(([tag, text]) => {
        const patch: IPatch = {
          type: PatchType.PARAGRAPH,
          children: [new TextRun(text)],
        };
        return [tag, patch];
      })
    );

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

export const docxResponse = (body: Uint8Array, filename: string) =>
  new Response(body, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}.docx"`,
    },
  });

export const xlsxResponse = (body: Uint8Array, filename: string) =>
  new Response(body, {
    headers: {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, year, _bureau, _division, pap, code] = activityCode.split('-');

  const program = pap as Program;
  const mfoCode = MFO_CODES[program];
  const appropriation: Appropriation = code.startsWith('P') ? 'Continuing' : 'Current';
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
