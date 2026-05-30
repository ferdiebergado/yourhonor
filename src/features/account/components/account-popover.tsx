import AddButton from '@/components/add-button';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useHonorariumFormContext } from '@/features/honorarium/hooks';
import AccountForm from './account-form';

type AccountPopoverProps = {
  payee?: string;
};

export default function AccountPopover({ payee }: AccountPopoverProps) {
  const { payeeId, isAccountFormOpen, setIsAccountFormOpen } = useHonorariumFormContext();

  return (
    <Popover open={isAccountFormOpen} onOpenChange={setIsAccountFormOpen}>
      <Tooltip>
        <TooltipTrigger
          render={<PopoverTrigger render={<AddButton disabled={payeeId === 0} />} />}
        />
        <TooltipContent>Add payee bank account</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-90">
        <PopoverHeader>
          <PopoverTitle className="font-heading text-xl font-semibold">
            Add payee bank account
          </PopoverTitle>
          <PopoverDescription>
            Add a new payee bank account by filling up the form below.
          </PopoverDescription>
        </PopoverHeader>
        {payee && (
          <Item className="p-0">
            <ItemHeader>Payee</ItemHeader>
            <ItemContent>
              <ItemTitle>{payee}</ItemTitle>
            </ItemContent>
          </Item>
        )}
        <AccountForm />
      </PopoverContent>
    </Popover>
  );
}
