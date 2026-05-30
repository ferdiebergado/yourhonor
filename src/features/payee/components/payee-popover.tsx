import AddButton from '@/components/add-button';
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
import PayeeForm from './payee-form';

export default function PayeePopover() {
  const { isPayeeFormOpen, setIsPayeeFormOpen } = useHonorariumFormContext();

  return (
    <Popover open={isPayeeFormOpen} onOpenChange={setIsPayeeFormOpen}>
      <Tooltip>
        <TooltipTrigger render={<PopoverTrigger render={<AddButton />} />} />
        <TooltipContent>Add payee</TooltipContent>
      </Tooltip>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle className="font-heading text-xl font-semibold">Add payee</PopoverTitle>
          <PopoverDescription>Add a new payee.</PopoverDescription>
        </PopoverHeader>
        <PayeeForm />
      </PopoverContent>
    </Popover>
  );
}
