export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'neumorphic-button text-primary-600 hover:text-primary-700',
    success: 'neumorphic-button text-green-600 hover:text-green-700',
    danger: 'neumorphic-button text-red-600 hover:text-red-700',
    secondary: 'neumorphic-button text-gray-600 hover:text-gray-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
