import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";

const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000); // 1s duration
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slide-up">
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-sm">
        <FaCheckCircle className="text-xl" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
