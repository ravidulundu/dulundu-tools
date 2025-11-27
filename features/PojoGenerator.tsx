
import React, { useState } from 'react';
import { FileCode, ArrowRight, Copy, Check, Trash2 } from 'lucide-react';

export const PojoGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [className, setClassName] = useState('Root');
  const [packageName, setPackageName] = useState('com.example');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const generateJava = (jsonStr: string) => {
    try {
      const obj = JSON.parse(jsonStr);
      let classes: string[] = [];
      
      const parseObject = (name: string, jsonObj: any) => {
         let classStr = `public class ${capitalize(name)} {\n`;
         
         Object.keys(jsonObj).forEach(key => {
             const value = jsonObj[key];
             let type = 'Object';
             
             if (value === null) type = 'Object';
             else if (typeof value === 'string') type = 'String';
             else if (typeof value === 'number') type = Number.isInteger(value) ? 'int' : 'double';
             else if (typeof value === 'boolean') type = 'boolean';
             else if (Array.isArray(value)) {
                 if (value.length > 0 && typeof value[0] === 'object') {
                     const subClassName = capitalize(key); // Singularize ideally
                     parseObject(subClassName, value[0]);
                     type = `List<${subClassName}>`;
                 } else if (value.length > 0) {
                     const innerType = typeof value[0] === 'string' ? 'String' : 'Object';
                     type = `List<${innerType}>`;
                 } else {
                     type = 'List<Object>';
                 }
             } else if (typeof value === 'object') {
                 const subClassName = capitalize(key);
                 parseObject(subClassName, value);
                 type = subClassName;
             }

             classStr += `    private ${type} ${key};\n`;
         });

         // Getters and Setters (simplified)
         Object.keys(jsonObj).forEach(key => {
             const value = jsonObj[key];
             let type = 'Object';
             // ... same type logic ...
             if (value === null) type = 'Object';
             else if (typeof value === 'string') type = 'String';
             else if (typeof value === 'number') type = Number.isInteger(value) ? 'int' : 'double';
             else if (typeof value === 'boolean') type = 'boolean';
             else if (Array.isArray(value)) {
                if (value.length > 0 && typeof value[0] === 'object') type = `List<${capitalize(key)}>`;
                else if (value.length > 0) type = `List<${typeof value[0] === 'string' ? 'String' : 'Object'}>`;
                else type = 'List<Object>';
             }
             else if (typeof value === 'object') type = capitalize(key);

             classStr += `\n    public ${type} get${capitalize(key)}() { return ${key}; }`;
             classStr += `\n    public void set${capitalize(key)}(${type} ${key}) { this.${key} = ${key}; }`;
         });

         classStr += `\n}\n`;
         classes.push(classStr);
      };

      parseObject(className, obj);
      
      const header = `package ${packageName};\n\nimport java.util.List;\n\n`;
      setOutput(header + classes.reverse().join('\n')); // Reverse so nested classes come first or handle file split. For single view, just join.
      setError(null);
    } catch (e) {
      setError("Invalid JSON input.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <FileCode size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">POJO Generator</h1>
                <p className="text-xs md:text-sm text-slate-500">Generate Java classes from JSON objects</p>
             </div>
           </div>

           <div className="flex items-center space-x-2">
             <button
               onClick={() => generateJava(input)}
               className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center text-sm"
             >
               Generate <ArrowRight size={16} className="ml-1.5" />
             </button>
             <button onClick={() => {setInput(''); setOutput(''); setError(null)}} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={20} />
             </button>
           </div>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center space-x-2">
                <label className="text-sm font-bold text-slate-600">Class Name:</label>
                <input 
                  type="text" value={className} onChange={(e) => setClassName(e.target.value)}
                  className="p-1.5 border border-gray-300 rounded text-sm w-32 outline-none focus:border-primary"
                />
            </div>
            <div className="flex items-center space-x-2">
                <label className="text-sm font-bold text-slate-600">Package:</label>
                <input 
                  type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)}
                  className="p-1.5 border border-gray-300 rounded text-sm w-40 outline-none focus:border-primary"
                />
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Input */}
            <div className="flex flex-col h-full min-h-[300px]">
              <label className="block text-sm font-bold text-slate-700 mb-2">Input JSON</label>
              <div className={`flex-1 relative rounded-xl border transition-all shadow-inner overflow-hidden ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'}`}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-full p-4 bg-white font-mono text-sm text-slate-800 outline-none resize-none leading-relaxed"
                  placeholder='{"id": 1, "name": "Test"}'
                  spellCheck={false}
                />
              </div>
              {error && <p className="mt-2 text-xs text-red-500 font-bold">{error}</p>}
            </div>

            {/* Output */}
            <div className="flex flex-col h-full min-h-[300px]">
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-slate-700">Java POJO Output</label>
                 {output && (
                    <button 
                    onClick={handleCopy}
                    className={`text-xs flex items-center px-2 py-1 rounded transition-colors font-medium border ${copied ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-primary border-primary/20 hover:bg-blue-50'}`}
                    >
                    {copied ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
                    {copied ? 'Copied' : 'Copy'}
                    </button>
                 )}
              </div>
              <div className="flex-1 rounded-xl border border-gray-800 bg-[#1e293b] overflow-hidden shadow-md">
                 <textarea
                   readOnly
                   value={output}
                   placeholder="Java class code will appear here..."
                   className="w-full h-full p-4 bg-[#1e293b] text-gray-50 font-mono text-sm outline-none resize-none leading-relaxed"
                 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
