import dynamic from 'next/dynamic';
import { DeepgramContextProvider } from '../lib/contexts/DeepgramContext';

const ChatInterface = dynamic(() => import('../components/ChatInterface'), { ssr: false });

export default function Home() {
  return (
    <DeepgramContextProvider>
      <main className="h-screen">
        <ChatInterface />
      </main>
    </DeepgramContextProvider>
  );
}
