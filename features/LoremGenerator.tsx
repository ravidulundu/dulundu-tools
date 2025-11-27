import React, { useState } from 'react';
import { FileText, RefreshCw, Copy, Check } from 'lucide-react';

export const LoremGenerator: React.FC = () => {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const LOREM_TEXT = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
    "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus."
  ];

  const generateLorem = () => {
    let result = [];
    for (let i = 0; i < paragraphs; i++) {
        const text = LOREM_TEXT[i % LOREM_TEXT.length]; 
        result.push(text);
    }
    setOutput(result.join('\n\n'));
    setCopied(false);
  };

  React.useEffect(() => {
    generateLorem();
  }, [paragraphs]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
           <div className="p-2 bg-blue-100 text-primary rounded-lg">
              <FileText size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-800">Lorem Ipsum Generator</h1>
              <p className="text-sm text-slate-500">Generate placeholder text for your designs</p>
           </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row items-end md:items-center gap-4 mb-8">
             <div className="flex-1 w-full">
               <label className="block text-sm font-medium text-slate-700 mb-2">Number of Paragraphs (1-20)</label>
               <input 
                 type="range" 
                 min="1" 
                 max="20" 
                 value={paragraphs} 
                 onChange={(e) => setParagraphs(parseInt(e.target.value))}
                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
               />
               <div className="text-center mt-2 font-bold text-primary">{paragraphs} Paragraphs</div>
             </div>
             <button 
               onClick={generateLorem} 
               className="w-full md:w-auto px-6 py-3 bg-white border border-gray-300 text-slate-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center font-medium shadow-sm"
             >
               <RefreshCw size={20} className="mr-2" />
               Regenerate
             </button>
          </div>

          <div className="relative group">
             <div className="absolute top-4 right-4">
                <button 
                  onClick={handleCopy} 
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm ${copied ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-700 text-slate-300 border border-slate-600 hover:text-white'}`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
             </div>
             <div className="relative rounded-xl border border-gray-800 bg-[#1e293b] overflow-hidden shadow-md">
                <textarea 
                    readOnly
                    value={output}
                    className="w-full h-96 p-6 bg-[#1e293b] text-gray-50 text-base leading-relaxed resize-none outline-none font-sans"
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};