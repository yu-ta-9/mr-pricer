import Link from 'next/link';

const NotFound = () => {
  return (
    <div className='min-h-screen p-24'>
      <h1 className='text-danger'>404 - Page Not Found</h1>
      <Link className='underline' href='/'>
        TOPへ
      </Link>
    </div>
  );
};

export default NotFound;
