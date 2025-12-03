import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('xml', xml);

interface CodeTabProps {
  code: string;
  language?: string;
}

export const CodeTab: React.FC<CodeTabProps> = ({ code, language = 'typescript' }) => {
  return (
    <div className="w-full h-full bg-white overflow-auto">
      <SyntaxHighlighter
        language={language}
        style={atomOneLight}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '13px',
          height: '100%',
        }}
        showLineNumbers={true}
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1em',
          color: '#9ca3af', // gray-400
          textAlign: 'right',
        }}
        wrapLines={true}
        codeTagProps={{
          style: {
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
