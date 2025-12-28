import React from 'react';

import { SEO } from '@/components/SEO';

export const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title="Terms of Service - Dulundu.tools"
        description="Terms of Service and acceptable use policy for Dulundu.tools developer utilities."
      />

      <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>

      <div className="max-w-none text-foreground-secondary [&_h2]:text-foreground [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-foreground [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-primary [&_a]:hover:underline">
        <p className="text-sm text-foreground-muted mb-8">Last Updated: December 28, 2025</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Dulundu.tools (&quot;the Service&quot;), you accept and agree to be
          bound by the terms and provision of this agreement. If you do not agree to these Terms of
          Service, please do not use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>Dulundu.tools provides free online developer utilities including but not limited to:</p>
        <ul>
          <li>Code formatters and validators</li>
          <li>Encoding/decoding tools</li>
          <li>Text manipulation utilities</li>
          <li>Data conversion tools</li>
          <li>Generator utilities</li>
        </ul>
        <p>All tools are provided as-is without any warranties or guarantees.</p>

        <h2>3. Acceptable Use</h2>
        <p>You agree NOT to use the Service to:</p>
        <ul>
          <li>Violate any local, state, national, or international law</li>
          <li>Process sensitive personal data without proper authorization</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Transmit malware, viruses, or malicious code</li>
          <li>Engage in activities that could harm the Service or other users</li>
          <li>Scrape or automate requests beyond reasonable personal use</li>
        </ul>

        <h2>4. Rate Limiting and Fair Use</h2>
        <p>To ensure service availability for all users, we implement rate limiting:</p>
        <ul>
          <li>AI-powered features: Maximum 100 requests per 15 minutes</li>
          <li>File uploads: Maximum 10MB per request</li>
          <li>API endpoints: Subject to rate limiting based on IP address</li>
        </ul>
        <p>Excessive use may result in temporary or permanent service restrictions.</p>

        <h2>5. Data Processing and Privacy</h2>
        <p>
          <strong>Client-Side Processing:</strong> Most tools process data entirely in your browser.
          Your data never leaves your device.
        </p>
        <p>
          <strong>Server-Side Features:</strong> Some features (AI assistance, shared links)
          temporarily process data on our servers. This data is:
        </p>
        <ul>
          <li>Not permanently stored unless you explicitly create a shareable link</li>
          <li>Automatically deleted after the expiration period you set</li>
          <li>Never sold or shared with third parties</li>
        </ul>
        <p>
          <strong>DO NOT</strong> process sensitive personal information (passwords, credit cards,
          health records, etc.) through our tools.
        </p>

        <h2>6. GDPR Compliance (EU Users)</h2>
        <p>
          For users in the European Union, we comply with the General Data Protection Regulation
          (GDPR):
        </p>
        <ul>
          <li>
            <strong>Right to Access:</strong> You can request information about data we process
          </li>
          <li>
            <strong>Right to Deletion:</strong> You can request deletion of your data
          </li>
          <li>
            <strong>Right to Portability:</strong> You can export your shared links
          </li>
          <li>
            <strong>Data Minimization:</strong> We only collect necessary analytics data
          </li>
        </ul>
        <p>
          Contact:{' '}
          <a href="mailto:privacy@dulundu.tools" className="text-primary hover:text-primary/80">
            privacy@dulundu.tools
          </a>
        </p>

        <h2>7. LGPD Compliance (Brazil Users)</h2>
        <p>For users in Brazil, we comply with Lei Geral de Proteção de Dados (LGPD):</p>
        <ul>
          <li>Data processing is limited and transparent</li>
          <li>You have the right to access and delete your data</li>
          <li>We do not share data with third parties without consent</li>
        </ul>

        <h2>8. Intellectual Property</h2>
        <p>
          The Service and its original content, features, and functionality are owned by
          Dulundu.tools and are protected by international copyright, trademark, and other
          intellectual property laws.
        </p>
        <p>
          <strong>Your Content:</strong> You retain all rights to any data you process through our
          tools. We claim no ownership of your content.
        </p>

        <h2>9. Third-Party Services</h2>
        <p>Our Service uses the following third-party services:</p>
        <ul>
          <li>
            <strong>Iconify API:</strong> For loading icon graphics
          </li>
          <li>
            <strong>Google Fonts:</strong> For typography
          </li>
          <li>
            <strong>Umami Analytics:</strong> For privacy-friendly usage statistics (no personal
            data)
          </li>
          <li>
            <strong>AI Providers:</strong> For AI-powered features (data not stored)
          </li>
        </ul>

        <h2>10. Disclaimer of Warranties</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
          OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
        </p>
        <ul>
          <li>Accuracy or completeness of results</li>
          <li>Uninterrupted or error-free operation</li>
          <li>Fitness for a particular purpose</li>
        </ul>

        <h2>11. Limitation of Liability</h2>
        <p>
          IN NO EVENT SHALL DULUNDU.TOOLS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.
        </p>

        <h2>12. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will be effective
          immediately upon posting. Continued use of the Service constitutes acceptance of modified
          terms.
        </p>

        <h2>13. Termination</h2>
        <p>
          We reserve the right to terminate or suspend access to the Service immediately, without
          prior notice, for any violation of these Terms of Service.
        </p>

        <h2>14. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the
          jurisdiction where the service is operated, without regard to its conflict of law
          provisions.
        </p>

        <h2>15. Contact Information</h2>
        <p>If you have any questions about these Terms, please contact us at:</p>
        <p>
          <strong>Email:</strong>{' '}
          <a href="mailto:legal@dulundu.tools" className="text-primary hover:text-primary/80">
            legal@dulundu.tools
          </a>
          <br />
          <strong>Website:</strong> dulundu.tools
        </p>
      </div>
    </div>
  );
};
