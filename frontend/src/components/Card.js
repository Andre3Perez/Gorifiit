export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`neumorphic-card p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
