import { useEffect } from "react";
import { ModalOverlay, ModalContent, ModalImage, CloseButton } from "./styles";
import { IoClose } from "react-icons/io5";

interface ImageModalProps {
  isOpen: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
}

export default function ImageModal({ isOpen, src, alt, onClose }: ImageModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <IoClose />
        </CloseButton>
        <ModalImage src={src} alt={alt || "Image preview"} />
      </ModalContent>
    </ModalOverlay>
  );
}
