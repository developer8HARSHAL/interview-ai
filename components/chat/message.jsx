 
// components/chat/message.jsx
import { formatDate } from '@/lib/utils/helpers';

export default function Message({ content, role, timestamp }) {
  return (
    <div
      className={`flex flex-col ${
        role === 'user' ? 'items-end' : 'items-start'
      }`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-lg ${
          role === 'user'
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-gray-200 text-gray-800 rounded-tl-none'
        }`}
      >
        <div className="text-sm whitespace-pre-wrap">{content}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {formatDate(timestamp)}
      </div>
    </div>
  );
}