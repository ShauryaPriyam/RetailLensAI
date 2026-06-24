const Skeleton = ({
  className = "",
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-100 rounded-lg ${className}`}
    />
  );
};

export default Skeleton;