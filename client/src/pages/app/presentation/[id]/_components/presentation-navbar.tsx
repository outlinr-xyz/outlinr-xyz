import {
  ArrowLeftIcon,
  CloudIcon,
  CloudOffIcon,
  LinkIcon,
  Loader2Icon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import ShareDialog from '@/components/share-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getPresentation, updatePresentation } from '@/lib/api/presentations';
import { cn } from '@/lib/utils';
import { useUser, useUserDisplayName } from '@/store/auth.store';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const PresentationNavbar = () => {
  const { id } = useParams<{ id: string }>();
  // FIX: Get the location object
  const location = useLocation();
  const user = useUser();
  const displayName = useUserDisplayName();

  const [title, setTitle] = useState('');
  const [lastSavedTitle, setLastSavedTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);

  useEffect(() => {
    if (!id) {
      setTitle('Untitled Presentation');
      setLastSavedTitle('Untitled Presentation');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getPresentation(id)
      .then((presentation) => {
        setTitle(presentation.title);
        setLastSavedTitle(presentation.title);
        setSaveStatus('saved');
      })
      .catch(() => {
        setTitle('Error loading title');
        setLastSavedTitle('Error loading title');
        setSaveStatus('error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle === '') {
      setTitle(lastSavedTitle);
      setSaveStatus('saved');
      return;
    }
    if (trimmedTitle === lastSavedTitle) {
      setSaveStatus('saved');
      return;
    }

    if (!id || saveStatus === 'saving') return;

    setSaveStatus('saving');
    try {
      await updatePresentation(id, { title: trimmedTitle });
      setLastSavedTitle(trimmedTitle); // Set new good title
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link to="/app/home">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
        </Button>
        {isLoading ? (
          <div className="h-9 w-64 animate-pulse rounded-md bg-gray-200" />
        ) : (
          <Input
            value={title}
            onChange={handleTitleChange}
            onBlur={handleSave}
            className="h-9 w-64 border-none text-lg font-semibold shadow-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
          />
        )}
      </div>
      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            className={cn(
              'rounded-full',
              // Use location.pathname here
              location.pathname.includes('question') &&
                'bg-gray-100 text-gray-900',
            )}
            asChild
          >
            <Link to={`/app/presentation/${id}/question`}>Create</Link>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              'rounded-full',
              // Use location.pathname here
              location.pathname.includes('results') &&
                'bg-gray-100 text-gray-900',
            )}
            asChild
          >
            <Link to={`/app/presentation/${id}/results`}>Results</Link>
          </Button>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex h-6 w-32 items-center justify-start gap-2 text-sm text-gray-500">
          {saveStatus === 'saving' ? (
            <>
              <Loader2Icon className="h-4 w-4 shrink-0 animate-spin" />
              <span className="text-xs">Saving...</span>
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <CloudIcon className="h-4 w-4 shrink-0" />
              <span className="text-xs">Saved to Cloud</span>
            </>
          ) : saveStatus === 'error' ? (
            <>
              <CloudOffIcon className="h-4 w-4 shrink-0 text-red-500" />
              <span className="text-xs text-red-500">Save failed</span>
            </>
          ) : (
            <>
              <CloudOffIcon className="h-4 w-4 shrink-0" />
              <span className="text-xs">Unsaved</span>
            </>
          )}
        </div>
        <Button variant="outline" className="rounded-full" asChild>
          <Link to={`/app/presentation/${id}/preview`}>Present</Link>
        </Button>
        <Button
          className="rounded-full bg-[#254BF5] text-white hover:bg-[#254BF5]/90"
          onClick={() => setShowShareDialog(true)}
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          Share
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar>
                <AvatarImage
                  src={user?.user_metadata?.avatar_url}
                  alt={displayName}
                />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{displayName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {id && (
        <ShareDialog
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
          presentationId={id}
          presentationTitle={title}
        />
      )}
    </header>
  );
};

export default PresentationNavbar;
