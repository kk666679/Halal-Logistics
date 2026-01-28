/**
 * Chat Page
 * 
 * Main page for the HalalChain AI Assistant chat interface.
 */

import { ChatInterface } from '../../components/chat/ChatInterface';

export const metadata = {
  title: 'HalalChain AI Assistant | Chat',
  description: 'AI-powered developer assistant for building halal logistics applications',
};

export default function ChatPage() {
  return (
    <main className="h-screen">
      <ChatInterface />
    </main>
  );
}
