import { Globe, Search, Info } from 'lucide-react';
import React, { useState } from 'react';

import { ToolHeader } from '@/components/common/ToolHeader';

const CODES = [
  { code: 100, title: 'Continue', desc: 'The client should continue with its request.' },
  {
    code: 101,
    title: 'Switching Protocols',
    desc: 'The server is switching protocols as requested.',
  },
  { code: 200, title: 'OK', desc: 'The request succeeded.' },
  { code: 201, title: 'Created', desc: 'The request succeeded and a new resource was created.' },
  {
    code: 202,
    title: 'Accepted',
    desc: 'The request has been accepted for processing, but processing is not completed.',
  },
  {
    code: 204,
    title: 'No Content',
    desc: 'The server successfully processed the request and is not returning any content.',
  },
  {
    code: 301,
    title: 'Moved Permanently',
    desc: 'The URL of the requested resource has been changed permanently.',
  },
  {
    code: 302,
    title: 'Found',
    desc: 'The URL of the requested resource has been changed temporarily.',
  },
  {
    code: 304,
    title: 'Not Modified',
    desc: 'Indicates the resource has not been modified since the version specified by the request headers.',
  },
  {
    code: 307,
    title: 'Temporary Redirect',
    desc: 'The request should be repeated with another URI; however, future requests should still use the original URI.',
  },
  {
    code: 400,
    title: 'Bad Request',
    desc: 'The server could not understand the request due to invalid syntax.',
  },
  {
    code: 401,
    title: 'Unauthorized',
    desc: 'The client must authenticate itself to get the requested response.',
  },
  { code: 403, title: 'Forbidden', desc: 'The client does not have access rights to the content.' },
  { code: 404, title: 'Not Found', desc: 'The server can not find the requested resource.' },
  {
    code: 405,
    title: 'Method Not Allowed',
    desc: 'The request method is known by the server but is not supported by the target resource.',
  },
  {
    code: 408,
    title: 'Request Timeout',
    desc: 'This response is sent on an idle connection by some servers.',
  },
  {
    code: 418,
    title: "I'm a teapot",
    desc: 'The server refuses the attempt to brew coffee with a teapot.',
  },
  {
    code: 429,
    title: 'Too Many Requests',
    desc: 'The user has sent too many requests in a given amount of time.',
  },
  {
    code: 500,
    title: 'Internal Server Error',
    desc: "The server has encountered a situation it doesn't know how to handle.",
  },
  {
    code: 501,
    title: 'Not Implemented',
    desc: 'The request method is not supported by the server and cannot be handled.',
  },
  {
    code: 502,
    title: 'Bad Gateway',
    desc: 'The server, while working as a gateway or proxy, received an invalid response.',
  },
  {
    code: 503,
    title: 'Service Unavailable',
    desc: 'The server is not ready to handle the request.',
  },
  {
    code: 504,
    title: 'Gateway Timeout',
    desc: 'The server is acting as a gateway and cannot get a response in time.',
  },
];

export const HttpStatusCodes: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = CODES.filter(
    c =>
      c.code.toString().includes(search) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase())
  );

  const getColor = (code: number) => {
    if (code < 200) return 'bg-primary-light text-primary border-primary/20';
    if (code < 300) return 'bg-success-light text-success border-success/20';
    if (code < 400) return 'bg-warning-light text-warning border-warning/20';
    if (code < 500) return 'bg-warning-light text-warning border-warning/20';
    return 'bg-danger-light text-danger border-danger/20';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Globe}
          title="HTTP Status Codes"
          description="Reference guide for web server response codes"
        />

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search Bar */}
          <div className="p-4 md:p-6 border-b border-border bg-card">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by code, title, or description..."
                className="w-full p-4 pl-12 bg-background-secondary border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition-all"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted"
                size={20}
              />
            </div>
          </div>

          {/* Grid Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background-secondary/30">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {filtered.map(item => (
                <div
                  key={item.code}
                  className="p-5 border border-border rounded-xl hover:shadow-md transition-all bg-card flex flex-col h-full group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-lg font-bold border ${getColor(item.code)}`}
                    >
                      {item.code}
                    </span>
                    {item.code === 418 && <span className="text-xl animate-bounce">🫖</span>}
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground-muted leading-relaxed flex-1 flex items-start">
                    <Info size={14} className="mr-1.5 mt-0.5 flex-shrink-0 opacity-50" />
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-foreground-muted">
                <p>No status codes found matching &quot;{search}&quot;</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
