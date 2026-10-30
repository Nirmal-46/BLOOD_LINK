import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-slate-900">404</span>
          <h1 className="text-xl font-bold text-slate-800">Page Not Found</h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            The blood requirement or resource you are looking for might have been moved or completed.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" icon={Home}>
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
