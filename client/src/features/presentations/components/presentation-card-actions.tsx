import { Eye, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deletePresentation } from '@/lib/api/presentations';

interface PresentationCardActionsProps {
  presentationId: string;
  variant?: 'grid' | 'list';
  onDelete?: () => void;
}

const PresentationCardActions = ({
  presentationId,
  variant = 'grid',
  onDelete,
}: PresentationCardActionsProps) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/app/presentation/${presentationId}/preview`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deletePresentation(presentationId);
      toast.success('Presentation moved to trash');
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Failed to delete presentation:', error);
      toast.error('Failed to delete presentation');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const buttonClasses =
    variant === 'grid'
      ? 'rounded-md bg-white p-1.5 text-gray-700 shadow-sm hover:bg-gray-50'
      : 'rounded-md p-1.5 text-gray-700 hover:bg-gray-100';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={buttonClasses}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This presentation will be moved to trash. You can restore it later
              or delete it permanently from the trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PresentationCardActions;
