interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="text-muted-foreground mt-24 text-center text-sm md:mt-32 lg:mt-48">
      {message}
    </div>
  );
};

export default EmptyState;
