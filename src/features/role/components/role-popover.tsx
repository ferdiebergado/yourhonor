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
import RoleForm from './role-form';

export default function RolePopover() {
  const { isRoleFormOpen, setIsRoleFormOpen } = useHonorariumFormContext();

  return (
    <Popover open={isRoleFormOpen} onOpenChange={setIsRoleFormOpen}>
      <Tooltip>
        <TooltipTrigger render={<PopoverTrigger render={<AddButton />} />} />
        <TooltipContent>Add role</TooltipContent>
      </Tooltip>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle className="font-heading text-xl font-semibold">Add role</PopoverTitle>
          <PopoverDescription>Add a new role.</PopoverDescription>
        </PopoverHeader>
        <RoleForm />
      </PopoverContent>
    </Popover>
  );
}
