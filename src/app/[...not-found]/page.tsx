import { notFound } from 'next/navigation';

/**
 * MEMO:
 * Next.jsのバグへの対応
 * https://github.com/vercel/next.js/issues/49281#issuecomment-1537098593
 */
export default function NotFound() {
  notFound();
}
