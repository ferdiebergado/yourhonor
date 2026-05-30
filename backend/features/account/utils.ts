export function maskAccountNo(accountNo: string): string {
  const visible = 4;

  if (accountNo.length <= visible) return accountNo;

  return `${'*'.repeat(accountNo.length - visible)}${accountNo.slice(-visible)}`;
}
