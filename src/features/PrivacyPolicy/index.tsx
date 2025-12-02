import React from "react";
import { SEO } from "@/components/SEO";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title="Privacy Policy - Dulundu.tools"
        description="Privacy Policy explaining how Dulundu.tools handles your data and protects your privacy."
      />

      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: December 2, 2024
        </p>

        <h2>1. Introduction</h2>
        <p>
          Dulundu.tools ("we", "our", or "us") is committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, and
          safeguard your information when you use our Service.
        </p>
        <p>
          <strong>Key Principle:</strong> We minimize data collection and
          process most data client-side in your browser.
        </p>

        <h2>2. Data We Collect</h2>

        <h3>2.1 Analytics Data (Umami)</h3>
        <p>We collect anonymous usage statistics to improve the Service:</p>
        <ul>
          <li>Page views and navigation patterns</li>
          <li>Browser type and version</li>
          <li>Device type (desktop/mobile)</li>
          <li>General geographic location (country level)</li>
          <li>Referrer information</li>
        </ul>
        <p>
          <strong>Privacy-Friendly:</strong> Umami does NOT collect:
        </p>
        <ul>
          <li>IP addresses (anonymized)</li>
          <li>Personal identifiers</li>
          <li>Cookies or tracking pixels</li>
          <li>Cross-site tracking data</li>
        </ul>

        <h3>2.2 Shared Links (Optional Feature)</h3>
        <p>When you create a shareable link:</p>
        <ul>
          <li>We store the content you choose to share</li>
          <li>A random 8-character ID is generated</li>
          <li>Optional expiration time (1 hour, 24 hours, 7 days, or never)</li>
          <li>No personal information is attached to shared links</li>
        </ul>

        <h3>2.3 AI Features (Optional)</h3>
        <p>When you use AI-powered features:</p>
        <ul>
          <li>Your prompt is sent to Google Gemini AI for processing</li>
          <li>Responses are generated and returned to you</li>
          <li>We do NOT store prompts or responses</li>
          <li>
            Google's AI may process data according to their privacy policy
          </li>
        </ul>

        <h2>3. Data We DON'T Collect</h2>
        <ul>
          <li>❌ Email addresses (no account required)</li>
          <li>❌ Names or personal identifiers</li>
          <li>❌ Payment information (service is free)</li>
          <li>❌ Content you process in browser-based tools</li>
          <li>❌ IP addresses (anonymized in analytics)</li>
          <li>❌ Third-party cookies</li>
        </ul>

        <h2>4. How We Use Your Data</h2>
        <p>We use collected data solely for:</p>
        <ul>
          <li>Improving service performance and user experience</li>
          <li>Understanding which tools are most useful</li>
          <li>Detecting and preventing abuse</li>
          <li>Providing shared link functionality (when you create one)</li>
        </ul>
        <p>
          <strong>We NEVER:</strong>
        </p>
        <ul>
          <li>Sell your data to third parties</li>
          <li>Use data for advertising or marketing</li>
          <li>Share data except as required by law</li>
        </ul>

        <h2>5. Browser-Based Processing</h2>
        <p>
          Most tools process data entirely in your browser using JavaScript:
        </p>
        <ul>
          <li>JSON Formatter</li>
          <li>Base64 Converter</li>
          <li>Hash Generator</li>
          <li>UUID Generator</li>
          <li>Code Formatter</li>
          <li>And many others...</li>
        </ul>
        <p>
          <strong>Your data never leaves your device</strong> for these tools.
          We cannot and do not access this data.
        </p>

        <h2>6. Server-Side Processing</h2>
        <p>Only these features send data to our servers:</p>
        <ul>
          <li>
            <strong>Share Feature:</strong> When you explicitly create a
            shareable link
          </li>
          <li>
            <strong>AI Features:</strong> When you use AI code helper or
            paraphrasing
          </li>
        </ul>
        <p>Server-processed data is:</p>
        <ul>
          <li>Transmitted over HTTPS (encrypted)</li>
          <li>Not logged or stored (except shared links)</li>
          <li>Automatically deleted based on expiration settings</li>
        </ul>

        <h2>7. GDPR Rights (EU Users)</h2>
        <p>If you are in the European Union, you have the following rights:</p>
        <ul>
          <li>
            <strong>Right to Access:</strong> Request a copy of data we have
            about you
          </li>
          <li>
            <strong>Right to Rectification:</strong> Correct inaccurate data
          </li>
          <li>
            <strong>Right to Erasure:</strong> Request deletion of your data
          </li>
          <li>
            <strong>Right to Restriction:</strong> Limit how we process your
            data
          </li>
          <li>
            <strong>Right to Data Portability:</strong> Receive data in a
            portable format
          </li>
          <li>
            <strong>Right to Object:</strong> Object to data processing
          </li>
        </ul>
        <p>
          To exercise these rights, contact:{" "}
          <a href="mailto:privacy@dulundu.tools" className="text-blue-600">
            privacy@dulundu.tools
          </a>
        </p>

        <h2>8. LGPD Rights (Brazil Users)</h2>
        <p>If you are in Brazil, you have rights under LGPD including:</p>
        <ul>
          <li>Confirmation of data processing</li>
          <li>Access to your data</li>
          <li>Correction of incomplete or inaccurate data</li>
          <li>Anonymization, blocking, or deletion of data</li>
          <li>Data portability</li>
          <li>Information about data sharing</li>
        </ul>
        <p>
          Contact:{" "}
          <a href="mailto:privacy@dulundu.tools" className="text-blue-600">
            privacy@dulundu.tools
          </a>
        </p>

        <h2>9. Data Retention</h2>
        <ul>
          <li>
            <strong>Analytics:</strong> 90 days (anonymized)
          </li>
          <li>
            <strong>Shared Links:</strong> Based on your selected expiration (1
            hour to never)
          </li>
          <li>
            <strong>AI Prompts:</strong> Not stored
          </li>
          <li>
            <strong>Browser-Processed Data:</strong> Never reaches our servers
          </li>
        </ul>

        <h2>10. Data Security</h2>
        <p>We implement industry-standard security measures:</p>
        <ul>
          <li>HTTPS encryption for all data transmission</li>
          <li>Content Security Policy (CSP) headers</li>
          <li>XSS protection with DOMPurify</li>
          <li>Rate limiting to prevent abuse</li>
          <li>File upload size limits (10MB)</li>
          <li>Regular security audits</li>
        </ul>

        <h2>11. Third-Party Services</h2>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2">Service</th>
              <th className="border p-2">Purpose</th>
              <th className="border p-2">Data Shared</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Umami Analytics</td>
              <td className="border p-2">Usage statistics</td>
              <td className="border p-2">Anonymous page views</td>
            </tr>
            <tr>
              <td className="border p-2">Iconify API</td>
              <td className="border p-2">Icon loading</td>
              <td className="border p-2">Icon request metadata</td>
            </tr>
            <tr>
              <td className="border p-2">Google Fonts</td>
              <td className="border p-2">Typography</td>
              <td className="border p-2">Font requests</td>
            </tr>
            <tr>
              <td className="border p-2">Google Gemini AI</td>
              <td className="border p-2">AI features (optional)</td>
              <td className="border p-2">Your prompts (not stored)</td>
            </tr>
          </tbody>
        </table>

        <h2>12. Children's Privacy</h2>
        <p>
          Our Service is not directed to individuals under 13. We do not
          knowingly collect personal information from children. If you believe a
          child has provided us with personal information, please contact us
          immediately.
        </p>

        <h2>13. Changes to Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated "Last Updated" date. Continued use
          of the Service constitutes acceptance of changes.
        </p>

        <h2>14. Contact Us</h2>
        <p>For privacy-related questions or to exercise your rights:</p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:privacy@dulundu.tools" className="text-blue-600">
            privacy@dulundu.tools
          </a>
          <br />
          <strong>Website:</strong> dulundu.tools
        </p>

        <h2>15. Consent</h2>
        <p>
          By using Dulundu.tools, you consent to this Privacy Policy and agree
          to its terms.
        </p>
      </div>
    </div>
  );
};
