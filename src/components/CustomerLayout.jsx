import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import FloatingCartButton from './ui/FloatingCartButton';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-background text-dark pb-20">
      <main className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative overflow-hidden">
        <Outlet />
        <FloatingCartButton />
      </main>
      <BottomNav />
    </div>
  );
}
