import { useRef, useState } from 'react';
import SingleImage from '../SingleImage';
import { CarouselWrapper, Track, Item, Prev, Next } from './styles';

interface CarouselItem {
  name: string;
  caption?: string;
}

interface ImageCarouselProps {
  images: CarouselItem[];
  itemWidth?: string;
  itemHeight?: string;
}

export default function ImageCarousel({ images, itemWidth = '240px', itemHeight = '140px' }: ImageCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [index, setIndex] = useState(0);

  const scrollToIndex = (i: number) => {
    const clamped = Math.max(0, Math.min(images.length - 1, i));
    setIndex(clamped);
    const el = itemRefs.current[clamped];
    if (el && trackRef.current) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  return (
    <CarouselWrapper>
      <Prev onClick={() => scrollToIndex(index - 1)} disabled={index <= 0}>{'<'}</Prev>
      <Next onClick={() => scrollToIndex(index + 1)} disabled={index >= images.length - 1}>{'>'}</Next>

      <Track ref={trackRef}>
        {images.map((img, i) => (
            <Item
                key={img.name}
                ref={(el) => {
                    itemRefs.current[i] = el;
                }}
                $w={itemWidth}
                $h={itemHeight}
            >
                <SingleImage imageName={img.name} width={itemWidth} height={itemHeight} caption={img.caption} />
            </Item>
        ))}
      </Track>
    </CarouselWrapper>
  );
}
