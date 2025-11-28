import React, { useState } from 'react';
import { FileCode, ArrowRight, Copy, Check, Trash2, Wand2 } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

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

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

        <ToolHeader
          icon={FileCode}
          title="POJO Generator"
          description="Generate Java classes from JSON objects"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-lg border border-gray-200">
              <label className="text-xs font-medium text-slate-500 pl-2">Class:</label>
              <input
                type="text" value={className} onChange={(e) => setClassName(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none w-32 p-1"
              />
            </div>
            <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-lg border border-gray-200">
              <label className="text-xs font-medium text-slate-500 pl-2">Package:</label>
              <input
                type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none w-40 p-1"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => generateJava(input)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center text-sm"
            >
              <Wand2 size={16} className="mr-1.5" /> Generate
            </button>
            <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <div className="flex flex-col h-full">
              <CodeEditor
                value={input}
                onChange={setInput}
                label="Input JSON"
                placeholder='{"id": 1, "name": "Test"}'
                language="json"
                theme="light"
              />
              {error && <p className="mt-2 text-xs text-red-500 font-bold animate-pulse">{error}</p>}
            </div>

            <CodeEditor
              value={output}
              label="Java POJO Output"
              placeholder="Java class code will appear here..."
              readOnly
              language="java"
              theme="dark"
              actions={
                output && (
                  <ActionButton
                    icon={copied ? Check : Copy}
                    label={copied ? 'Copied' : 'Copy'}
                    onClick={handleCopy}
                    variant={copied ? 'success' : 'primary'}
                  />
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
