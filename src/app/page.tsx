import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-8">智能旅行规划助手</h1>
        <p className="text-xl mb-8 text-gray-700">
          通过人工智能对话，轻松规划您的完美旅行行程
        </p>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">如何使用</h2>
          <ol className="text-left text-gray-700 space-y-4">
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 shrink-0">1</span>
              <span>告诉AI助手您想去的目的地、旅行时间和偏好</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 shrink-0">2</span>
              <span>通过自然对话调整和完善您的行程</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 shrink-0">3</span>
              <span>获取定制化的旅行行程安排，包含景点、住宿和餐饮建议</span>
            </li>
          </ol>
        </div>
        
        <Link href="/chat" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-8 py-3 transition-colors">
          开始规划我的旅行
        </Link>
      </div>
    </div>
  );
} 