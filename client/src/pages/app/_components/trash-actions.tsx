import { RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import {
  permanentlyDeletePresentation,
  restorePresentation,
} from '@/lib/api/presentations';

interface TrashActionsProps {
  presentationId: string;
  onAction?: () => void;
}

const TrashActions = ({ presentationId, onAction }: TrashActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRestore = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRestoring(true);

    try {
      await restorePresentation(presentationId);
      toast.success('Presentation restored successfully');
      if (onAction) {
        onAction();
      }
    } catch (error) {
      console.error('Failed to restore presentation:', error);
      toast.error('Failed to restore presentation');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handlePermanentDelete = async () => {
    setIsDeleting(true);
    try {
      await permanentlyDeletePresentation(presentationId);
      toast.success('Presentation permanently deleted');
      if (onAction) {
        onAction();
      }
    } catch (error) {
      console.error('Failed to permanently delete presentation:', error);
      toast.error('Failed to delete presentation');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div
        className="flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleRestore}
          disabled={isRestoring}
        >
          <RotateCcw className="h-4 w-4 md:mr-2" />
          <span className="hidden md:block">
            {isRestoring ? 'Restoring...' : 'Restore'}
          </span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4 md:mr-2" />
          <span className="hidden md:block">Delete Forever</span>
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently Delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This presentation will be
              permanently deleted from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TrashActions;
