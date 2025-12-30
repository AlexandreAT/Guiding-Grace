import React, { useState, useEffect } from 'react';
import { Wrapper, Thumb, Overlay, OverlayContent, LargeImage, CloseButton, Caption, CaptionBox } from './styles';

interface SingleImageProps {
  imageName: string; // filename inside public/maps, e.g. 'limgrave-top.jpg' or 'pin.png'
  width?: string; // css width (e.g. '300px' or '100%')
  height?: string; // css height
  alt?: string;
  caption?: string;
}

export default function SingleImage({ imageName, width, height, alt, caption }: SingleImageProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const src = `/maps/${imageName}`;

  return (
    <>
      <Wrapper w={width}>
        <Thumb src={src} alt={alt || imageName} onClick={() => setOpen(true)} draggable={false} h={height} />
        {caption && (
          <CaptionBox>
            <Caption fontSize='0.8em'>{caption}</Caption>
          </CaptionBox>
        )}
      </Wrapper>

      {open && (
        <Overlay onClick={() => setOpen(false)}>
          <OverlayContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setOpen(false)}>Fechar</CloseButton>
            <LargeImage src={src} alt={alt || imageName} draggable={false} />
            {caption && <Caption>{caption}</Caption>}
          </OverlayContent>
        </Overlay>
      )}
    </>
  );
}
