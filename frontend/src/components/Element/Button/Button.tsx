import clsx from "clsx";

interface ButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  label: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  isLoading = false,
  disabled = false,
  onClick,
  label,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        " py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent",
        "bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none"
      )}
      disabled={disabled || isLoading}
      aria-disabled={isLoading ? "true" : "false"}
    >
      {isLoading ? (
        <div className="dot-container  ">
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>
      ) : (
        label
      )}
    </button>
  );
};

export default Button;
