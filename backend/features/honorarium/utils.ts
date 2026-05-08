import type { IPatch } from 'docx';

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

    console.log('Document patched successfully.');
    return doc;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to patch document.', { cause: error });
  }
}

export function docxResponse(body: Buffer, filename: string) {
  return new Response(body, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}.docx"`,
    },
  });
}
