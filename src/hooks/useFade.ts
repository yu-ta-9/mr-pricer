import { useState, useEffect } from 'react';

/**
 * アニメーション実行完了後にDOMをアンマウントする
 * - MEMO : 0.25秒後にDOMを破棄するので、animation-durationは0.3秒に設定するのが望ましい
 * - MEMO : animation-durationを0.25秒にするとチラつくことがあるので注意する
 */
export const useFade = (isVisible: boolean, unMountTime?: number) => {
  const [display, setDisplay] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setDisplay(isVisible);
      return;
    }

    const unMountedTime = unMountTime || 250;
    const timer = setTimeout(() => setDisplay(false), unMountedTime);

    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, unMountTime]);

  return {
    display,
  };
};
