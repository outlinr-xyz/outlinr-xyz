import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import ShareDialog from '@/components/share-dialog';
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
  presentationTitle?: string;
  variant?: 'grid' | 'list';
  onDelete?: () => void;
}

const PresentationCardActions = ({
  presentationId,
  presentationTitle = 'Untitled Presentation',
  variant = 'grid',
  onDelete,
}: PresentationCardActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareDialog(true);
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
      ? 'rounded-full p-2 text-gray-600 hover:bg-white/80 hover:text-gray-900 transition-colors cursor-pointer'
      : 'rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer';

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
          <DropdownMenuItem className="cursor-pointer" onClick={handleShare}>
            Share
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="cursor-pointer text-red-500"
          >
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
              or it will be permanently deleted after 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="cursor-pointer bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        presentationId={presentationId}
        presentationTitle={presentationTitle}
      />
    </>
  );
};

export default PresentationCardActions;
