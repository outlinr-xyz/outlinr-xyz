import { Check, Copy, Info, Link2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createShare } from '@/lib/api/shares';
import type { SharePermission } from '@/types/share';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presentationId: string;
  presentationTitle: string;
}

const ShareDialog = ({
  open,
  onOpenChange,
  presentationId,
  presentationTitle,
}: ShareDialogProps) => {
  const [permission, setPermission] = useState<SharePermission>('view');
  const [expiresIn, setExpiresIn] = useState<string>('never');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const expiresInDays =
        expiresIn === 'never' ? undefined : parseInt(expiresIn);

      const result = await createShare({
        presentation_id: presentationId,
        permission,
        share_type: 'link',
        expires_in_days: expiresInDays,
        is_single_use: true,
      });

      setShareUrl(result.url);
      toast.success('Share link generated successfully');
    } catch (error) {
      console.error('Failed to generate share link:', error);
      toast.error('Failed to generate share link');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleClose = () => {
    setShareUrl('');
    setCopied(false);
    setPermission('view');
    setExpiresIn('never');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Presentation</DialogTitle>
          <DialogDescription>
            Generate a shareable link for "{presentationTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Share links are single-use only. Once someone opens the link, it
              will be automatically invalidated.
            </AlertDescription>
          </Alert>

          {!shareUrl ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="permission">Permission Level</Label>
                <RadioGroup
                  id="permission"
                  value={permission}
                  onValueChange={(value) =>
                    setPermission(value as SharePermission)
                  }
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="view" id="view" />
                    <Label
                      htmlFor="view"
                      className="cursor-pointer font-normal"
                    >
                      View only - Recipients can only view the presentation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="edit" id="edit" />
                    <Label
                      htmlFor="edit"
                      className="cursor-pointer font-normal"
                    >
                      Edit - Recipients can view and edit the presentation
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires">Link Expiration (Optional)</Label>
                <Select value={expiresIn} onValueChange={setExpiresIn}>
                  <SelectTrigger id="expires">
                    <SelectValue placeholder="Select expiration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never expires</SelectItem>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateLink}
                disabled={isGenerating}
                className="w-full"
              >
                <Link2 className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate Share Link'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="share-url">Share Link</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="share-url"
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> This link can only be used once.
                  After the first person opens it, the link will expire
                  automatically.
                </p>
              </div>

              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <div>
                  <p>
                    Permission:{' '}
                    <span className="text-foreground font-medium">
                      {permission === 'view' ? 'View only' : 'Can edit'}
                    </span>
                  </p>
                  <p>
                    Expires:{' '}
                    <span className="text-foreground font-medium">
                      {expiresIn === 'never'
                        ? 'Never'
                        : `In ${expiresIn} day${expiresIn === '1' ? '' : 's'}`}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShareUrl('')}
                >
                  Generate New Link
                </Button>
                <Button className="flex-1" onClick={handleClose}>
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
