import { AlertCircle, CheckCircle, Edit, Eye, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getPresentationByShareToken } from '@/lib/api/shares';
import type { Presentation } from '@/types';
import type { SharePermission } from '@/types/share';

const SharedPresentationPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [presentationId, setPresentationId] = useState<string | null>(null);
  const [permission, setPermission] = useState<SharePermission>('view');
  const [presentationTitle, setPresentationTitle] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setError('Invalid share link');
      setIsLoading(false);
      return;
    }

    const loadSharedPresentation = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getPresentationByShareToken(token);
        const presentation = result.presentation as Presentation;

        setPresentationId(presentation.id);
        setPermission(result.permission);
        setPresentationTitle(presentation.title || 'Untitled Presentation');
      } catch (err: unknown) {
        console.error('Failed to load shared presentation:', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to load shared presentation. The link may be invalid, expired, or already used.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedPresentation();
  }, [token]);

  const handleAccess = () => {
    if (!presentationId) return;

    if (permission === 'edit') {
      navigate(`/app/presentation/${presentationId}/question`);
    } else {
      navigate(`/app/presentation/${presentationId}/preview`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#254BF5]" />
          <p className="mt-4 text-lg text-gray-600">
            Loading shared presentation...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription className="mt-2">{error}</AlertDescription>
          </Alert>

          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-gray-900">
              Common reasons this might happen:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  The link has already been used (links are single-use only)
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>The link has expired</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>The link was revoked by the owner</span>
              </li>
            </ul>
          </div>

          <Button className="mt-6 w-full" onClick={() => navigate('/app/home')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
            Access Granted
          </h1>

          <p className="mb-6 text-center text-gray-600">
            You have been granted access to:
          </p>

          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              {presentationTitle}
            </h2>

            <div className="flex items-center text-sm text-gray-600">
              {permission === 'edit' ? (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>
                    Edit Access - You can view and edit this presentation
                  </span>
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View Access - You can view this presentation</span>
                </>
              )}
            </div>
          </div>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> This link was single-use and has now
              been marked as used. You can continue to access this presentation
              through your "Shared with Me" section.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button
              onClick={handleAccess}
              className="w-full bg-[#254BF5] hover:bg-[#254BF5]/90"
            >
              {permission === 'edit' ? 'Open Editor' : 'View Presentation'}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/app/shared-with-me')}
              className="w-full"
            >
              Go to Shared with Me
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedPresentationPage;
