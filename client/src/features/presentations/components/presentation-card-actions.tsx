import { LineChart, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router';

interface PresentationCardActionsProps {
  presentationId: string;
  variant?: 'grid' | 'list';
}

const PresentationCardActions = ({
  presentationId,
  variant = 'grid',
}: PresentationCardActionsProps) => {
  const buttonClasses =
    variant === 'grid'
      ? 'absolute top-2 rounded-full bg-white p-2 text-gray-700 shadow-xs'
      : 'rounded-md p-2 text-gray-700';

  const resultsButtonClasses =
    variant === 'grid' ? `${buttonClasses} left-2` : buttonClasses;

  const moreButtonClasses =
    variant === 'grid' ? `${buttonClasses} right-2` : buttonClasses;

  return (
    <div className={variant === 'list' ? 'flex items-center gap-2' : ''}>
      <Link
        to={`/app/presentation/${presentationId}/results`}
        className={resultsButtonClasses}
        onClick={(e) => e.stopPropagation()}
      >
        <LineChart className="h-4 w-4" />
      </Link>

      <button
        className={moreButtonClasses}
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PresentationCardActions;
