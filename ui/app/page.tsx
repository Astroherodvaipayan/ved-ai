import ChatWindow from '@/components/ChatWindow';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Chat - ved',
  description: 'Chat with the internet, chat with ved.',
};

const Home = () => {
  return (
    <div className="relative">
      <div className="dot-background"></div>
      <div className="gradient-overlay"></div>
      <div className="relative z-20">
        <Suspense>
          <ChatWindow />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
