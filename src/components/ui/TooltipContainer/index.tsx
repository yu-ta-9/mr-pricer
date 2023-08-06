import { useEffect, useMemo, useRef, useState, type FC } from 'react';

import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** basis position for display position */
  basisRef: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
  verticalPosition: 'top' | 'bottom';
  horizontalPosition: 'left' | 'right';
  verticalOffset?: number;
  horizontalOffset?: number;
};

type Position = { top?: string; right?: string; bottom?: string; left?: string };

export const TooltipContainer: FC<Props> = ({
  children,
  basisRef,
  isOpen,
  onClose,
  verticalPosition,
  horizontalPosition,
  verticalOffset,
  horizontalOffset,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [basisRect, setBasisRect] = useState<DOMRect>();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (basisRef === null) {
      return;
    }

    setBasisRect(basisRef.getBoundingClientRect());
  }, [isOpen, basisRef]);

  const top = useMemo(
    () => (basisRect?.top || 0) + (basisRect?.height || 0) + (verticalOffset || 0),
    [basisRect?.top, basisRect?.height, verticalOffset],
  );
  const right = useMemo(
    () => document.documentElement.clientWidth - (basisRect?.right || 0) + (horizontalOffset || 0),
    [basisRect?.right, horizontalOffset],
  );
  const bottom = useMemo(
    () => document.documentElement.clientHeight - (basisRect?.top || 0) + (verticalOffset || 0),
    [basisRect?.top, verticalOffset],
  );
  const left = useMemo(() => (basisRect?.left || 0) + (horizontalOffset || 0), [basisRect?.left, horizontalOffset]);

  const position = useMemo<Position>(() => {
    const position: Position = {};

    if (ref.current === null) {
      return position;
    }

    switch (verticalPosition) {
      case 'top':
        if (top + ref.current.getBoundingClientRect().height > document.documentElement.clientHeight) {
          position.bottom = `${bottom}px`;
          break;
        }
        position.top = `${top}px`;
        break;
      case 'bottom':
        if (bottom - ref.current.getBoundingClientRect().height < 0) {
          position.top = `${top}px`;
          break;
        }
        position.bottom = `${bottom}px`;
        break;
    }

    // TODO: implement a function that detects horizontal position is overflow, but need to consider when sp
    switch (horizontalPosition) {
      case 'left':
        position.left = `${left}px`;
        break;
      case 'right':
        position.right = `${right}px`;
        break;
    }

    return position;
  }, [ref, verticalPosition, horizontalPosition, top, right, bottom, left]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* TODO: z-indexのglobal定義を作る */}
      <div className='fixed top-0 left-0 z-[20000] w-full h-full' onClick={onClose} />

      <div
        ref={ref}
        className='fixed z-[20010] min-w-[120px] bg-white drop-shadow rounded-lg animate-fade-in'
        role='tooltip'
        style={{ top: position.top, right: position.right, bottom: position.bottom, left: position.left }}
      >
        {children}
      </div>
    </>
  );
};
