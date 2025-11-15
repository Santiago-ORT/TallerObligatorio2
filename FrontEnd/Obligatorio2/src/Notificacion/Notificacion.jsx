import React, { useEffect } from "react";
import "./Notificacion.css";

const Notificacion = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notificacion ${type}`}>
      {message}
    </div>
  );
};

export default Notificacion;
