import { Twitter, Copy, Check, Eye } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';

export const TwitterCardGenerator: React.FC = () => {
  const [type, setType] = useState('summary_large_image');
  const [site, setSite] = useState('@dulundutools');
  const [title, setTitle] = useState('Amazing Developer Tools');
  const [desc, setDesc] = useState(
    'Free online utilities for developers. Format JSON, convert images, generate UUIDs and more.'
  );
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80'
  );
  const [copied, setCopied] = useState(false);

  const metaTags = `<!-- Twitter Card data -->
<meta name="twitter:card" content="${type}">
<meta name="twitter:site" content="${site}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${image}">

<!-- Open Graph data -->
<meta property="og:title" content="${title}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="http://www.example.com/" />
<meta property="og:image" content="${image}" />
<meta property="og:description" content="${desc}" />`;

  const handleCopy = () => {
    navigator.clipboard.writeText(metaTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Twitter}
          title="Twitter Card Generator"
          description="Create meta tags for social media previews"
          iconBgColor="bg-primary-light"
          iconColor="text-primary"
        />

        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid lg:grid-cols-2 gap-6 h-full">
            {/* Form */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-fit overflow-y-auto max-h-full">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="card-type"
                    className="block text-sm font-bold text-foreground-secondary mb-2"
                  >
                    Card Type
                  </label>
                  <select
                    id="card-type"
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full p-3 bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                    <option value="app">App</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="site-username"
                    className="block text-sm font-bold text-foreground-secondary mb-2"
                  >
                    Site Username
                  </label>
                  <input
                    id="site-username"
                    type="text"
                    value={site}
                    onChange={e => setSite(e.target.value)}
                    className="w-full p-3 bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="card-title"
                    className="block text-sm font-bold text-foreground-secondary mb-2"
                  >
                    Title
                  </label>
                  <input
                    id="card-title"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full p-3 bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="card-desc"
                    className="block text-sm font-bold text-foreground-secondary mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="card-desc"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    className="w-full p-3 h-24 bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    maxLength={200}
                  />
                  <p className="text-xs text-right text-foreground-muted mt-1">{desc.length}/200</p>
                </div>
                <div>
                  <label
                    htmlFor="image-url"
                    className="block text-sm font-bold text-foreground-secondary mb-2"
                  >
                    Image URL
                  </label>
                  <input
                    id="image-url"
                    type="text"
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    className="w-full p-3 bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Preview & Code */}
            <div className="flex flex-col h-full gap-6 overflow-hidden">
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex-shrink-0">
                <h3 className="text-sm font-bold text-foreground-muted uppercase tracking-wide mb-4 flex items-center">
                  <Eye size={16} className="mr-2" /> Live Preview
                </h3>

                {/* Card Preview Container */}
                <div className="max-w-md mx-auto bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  {type === 'summary_large_image' && (
                    <div
                      className="h-48 bg-background-secondary bg-cover bg-center"
                      style={{ backgroundImage: `url(${image})` }}
                    ></div>
                  )}
                  <div className={`p-4 ${type === 'summary' ? 'flex items-start' : ''}`}>
                    {type === 'summary' && (
                      <div
                        className="w-24 h-24 bg-background-secondary rounded-lg bg-cover bg-center mr-4 flex-shrink-0"
                        style={{ backgroundImage: `url(${image})` }}
                      ></div>
                    )}
                    <div>
                      <h4 className="font-bold text-foreground leading-tight mb-1">{title}</h4>
                      <p className="text-sm text-foreground-secondary line-clamp-2 mb-2">{desc}</p>
                      <p className="text-xs text-foreground-muted">{site.replace('@', '')}.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <CodeEditor
                  value={metaTags}
                  label="Generated Meta Tags"
                  readOnly
                  language="html"
                  theme="dark"
                  actions={
                    <ActionButton
                      icon={copied ? Check : Copy}
                      label={copied ? 'Copied' : 'Copy Code'}
                      onClick={handleCopy}
                      variant={copied ? 'success' : 'primary'}
                    />
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
