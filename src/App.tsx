import React from 'react';
import { Toaster } from './components/ui/Toast';
import AppHeader from './components/AppHeader';
import DataExtractor from './components/DataExtractor';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <DataExtractor />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;