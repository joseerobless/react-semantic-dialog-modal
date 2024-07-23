import React, { useRef, useEffect, ReactNode, FC, useState } from "react";
import "./Modal.css";

export interface AnimationOptions {
  direction: "top" | "bottom" | "left" | "right";
  speed: string;
  closeDirections?: Record<string, string>;
}

export interface ModalProps {
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  showCloseIcon?: boolean;
  closeOnEscape?: boolean;
  closeButtonText?: string;
  enableAnimation?: boolean;
  animationOptions?: AnimationOptions;
  header?: ReactNode;
  children?: ReactNode | ((closeModal: () => void, openModal: () => void, dialogRef: React.RefObject<HTMLDialogElement>) => ReactNode);
  footer?: ReactNode;
  defaultIcon?: ReactNode;
  fullscreen?: boolean;
  open?: boolean;
}

export const Modal: FC<ModalProps> = ({
  className,
  onOpen,
  onClose,
  showCloseButton = false,
  showCloseIcon = true,
  closeOnEscape = true,
  closeButtonText = "Close",
  enableAnimation = true,
  animationOptions = {
    direction: "bottom",
    speed: "600ms",
    closeDirections: {},
  },
  header,
  children,
  footer,
  defaultIcon = (
    <svg
      fill="#000000"
      width="20px"
      height="20px"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M202.82861,197.17188a3.99991,3.99991,0,1,1-5.65722,5.65624L128,133.65723,58.82861,202.82812a3.99991,3.99991,0,0,1-5.65722-5.65624L122.343,128,53.17139,58.82812a3.99991,3.99991,0,0,1,5.65722-5.65624L128,122.34277l69.17139-69.17089a3.99991,3.99991,0,0,1,5.65722,5.65624L133.657,128Z" />
    </svg>
  ),
  fullscreen = false,
  open = true,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const { direction, speed, closeDirections = {} } = animationOptions;

  const Directions: Record<string, string> = Object.freeze({
    top: "modalSlideInTop",
    left: "modalSlideInLeft",
    right: "modalSlideInRight",
    bottom: "modalSlideInBottom"
  });

  const CloseDirections: Record<string, string> = Object.freeze({
    top: "modalSlideOutTop",
    left: "modalSlideOutLeft",
    right: "modalSlideOutRight",
    bottom: "modalSlideOutBottom",
    ...closeDirections,
  });

  const calculateDistance = ({rect, direction, isOpening}: {rect: DOMRect, direction: string, isOpening: boolean}) => {
    switch (isOpening ? direction : CloseDirections[direction]) {
      case "left":
      case "modalSlideOutLeft":
        return `-${rect.left + rect.width}px`;
      case "right":
      case "modalSlideOutRight":
        return `${window.innerWidth - rect.left}px`;
      case "top":
      case "modalSlideOutTop":
        return `-${rect.top + rect.height}px`;
      case "bottom":
      case "modalSlideOutBottom":
        return `${window.innerHeight - rect.top}px`;
      default:
        return "100%";
    }
  };

  const setAnimationStyle = () => {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (rect) {
      const slideInDistanceX = calculateDistance({rect, direction, isOpening: true});
      const slideInDistanceY = calculateDistance({rect, direction, isOpening: true});

      document.documentElement.style.setProperty("--modal-slide-in-distance-x", slideInDistanceX);
      document.documentElement.style.setProperty("--modal-slide-in-distance-y", slideInDistanceY);
      document.documentElement.style.setProperty("--modal-animation-speed", speed);
      document.documentElement.style.setProperty("--modal-animation", Directions[direction]);
    }
  };

  const setClosingAnimationStyle = () => {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (rect) {
      const slideOutDistanceX = calculateDistance({rect, direction, isOpening: false});
      const slideOutDistanceY = calculateDistance({rect, direction, isOpening: false});

      document.documentElement.style.setProperty("--modal-slide-out-distance-x", slideOutDistanceX);
      document.documentElement.style.setProperty("--modal-slide-out-distance-y", slideOutDistanceY);
      document.documentElement.style.setProperty("--modal-animation", CloseDirections[direction]);

      setTimeout(() => {
        dialogRef.current?.close();
        setIsClosing(false);
      }, parseInt(speed.slice(0, -2)));
    }
  };

  const openModal = () => {
    if (isClosing) return;
    onOpen?.();
    dialogRef.current?.showModal();
    enableAnimation && setAnimationStyle();
  };

  const closeModal = () => {
    if (isClosing) return;
    setIsClosing(true);
    onClose?.();
    enableAnimation ? setClosingAnimationStyle() : dialogRef.current?.close(), setIsClosing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const isEnterKeyDownOnCloseEl = e.target instanceof HTMLElement && (e.target.className === 'dialog-modal__close-icon' || e.target.className === 'dialog-modal__close-button') && e.key === 'Enter';
    if(!closeOnEscape && !isEnterKeyDownOnCloseEl) return;

    e.preventDefault();
    if (e.key === "Escape" || isEnterKeyDownOnCloseEl) {
      closeModal();
    }
  };

  useEffect(() => {
    if (dialogRef.current && open) {
      openModal();
    }
  }, [open]);

  useEffect(() => {
    const unsetAnimationStyles = () => {
      document.documentElement.style.setProperty("--modal-slide-in-distance-x", null);
      document.documentElement.style.setProperty("--modal-slide-in-distance-y", null);
      document.documentElement.style.setProperty("--modal-animation-speed", null);
      document.documentElement.style.setProperty("--modal-animation", null);
      document.documentElement.style.setProperty("--modal-slide-out-distance-x", null);
      document.documentElement.style.setProperty("--modal-slide-out-distance-y", null);
    }

    if(!enableAnimation) {
      unsetAnimationStyles();
    }
  }, [enableAnimation])

  const backdropClickHandler = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      const rect = dialogRef.current?.getBoundingClientRect();
      const isInDialog =
        rect &&
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        closeModal();
      }
    }
  };

  const CloseButton = () => (
    <button className="dialog-modal__close-button" onClick={closeModal} title="Close Button">
      {closeButtonText}
    </button>
  );

  const CloseIcon = () => (
    <button className="dialog-modal__close-icon" onClick={closeModal} title="Close Icon" aria-label="Close">
      {defaultIcon}
    </button>
  );

  const dialogClassName = `dialog-modal${fullscreen ? " dialog-modal--fullscreen" : ""}${className ? ` ${className}` : ""}`;

  return (
    <dialog
      ref={dialogRef}
      className={dialogClassName}
      onClick={backdropClickHandler}
      role="dialog"
      aria-modal="true"
      title="Dialog Modal"
      onKeyDown={handleKeyDown}
    >
      {showCloseIcon && <CloseIcon />}
      {header && <div id="modal-header" className="dialog-modal__header">{header}</div>}
      <div className="dialog-modal__content" autoFocus>
        {typeof children === "function"
          ? children(closeModal, openModal, dialogRef)
          : children}
      </div>
      {footer && <div className="dialog-modal__footer">{footer}</div>}
      {showCloseButton && <CloseButton />}
    </dialog>
  );
};
