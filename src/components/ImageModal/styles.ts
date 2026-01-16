import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: zoomIn 0.3s ease-out;

  @keyframes zoomIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export const ModalImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border: 2px solid ${THEME.colors.gold};
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
`;

export const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: ${THEME.colors.gold};
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${THEME.spacing.sm};
  transition: color ${THEME.transitions.fast};
  z-index: 1001;

  &:hover {
    color: ${THEME.colors.goldLight};
  }

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
  }
`;
