import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define Message type
interface Message {
  id: number;
  content: string;
  created_at: string;
  // Add other properties as needed
}

function AIChatHistory() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
  }

  // ... rest of the component ...
}

// ... rest of the file ...