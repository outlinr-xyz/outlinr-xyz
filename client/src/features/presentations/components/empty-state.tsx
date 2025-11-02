interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="text-muted-foreground mt-4 text-center text-sm">
      {message}
    </div>
  );
};

export default EmptyState;
