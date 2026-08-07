const MFO_CODES = {
  BEC: '310100100003000',
  ELLN: '310100100007000',
  FLO: '310300100003000',
} as const;

type Appropriation = 'Current' | 'Continuing';
type Program = keyof typeof MFO_CODES;

interface FundCluster {
  year: number;
  appropriation: Appropriation;
  program: Program;
  mfoCode: (typeof MFO_CODES)[Program];
}

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
