import ChatInterface from '../components/ChatInterface';

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="w-[80%] h-[80vh] overflow-hidden shadow-lg rounded-lg">
        <ChatInterface />
      </div>
    </main>
  );
}
