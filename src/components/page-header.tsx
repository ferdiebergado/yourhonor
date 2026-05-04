import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
  children?: ReactNode | null;
};

// eslint-disable-next-line unicorn/no-null
export default function PageHeader({ title, description, children = null }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-5 p-5">
      <div>
        <h1 className="font-heading text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
