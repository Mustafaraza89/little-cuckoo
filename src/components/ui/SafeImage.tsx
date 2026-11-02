'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { FALLBACK_IMAGE } from '@/lib/images';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc = FALLBACK_IMAGE,
  className,
  ...rest
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  return (
    <Image
      {...rest}
      src={hasError || !imgSrc ? fallbackSrc : imgSrc}
      alt={alt || 'Little Cuckoo Organic Baby Apparel'}
      className={`${className || ''} ${hasError ? 'opacity-90' : ''}`}
      onError={() => {
        setHasError(true);
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
