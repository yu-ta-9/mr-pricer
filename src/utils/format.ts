/**
 * 3桁区切りの文字列に変換
 */
export const formatToThousandsSeparator = (number: number): string => {
  return number.toLocaleString();
};
