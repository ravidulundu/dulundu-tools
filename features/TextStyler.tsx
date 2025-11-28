import React, { useState } from 'react';
import { Type, Copy, Check } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';

export const TextStyler: React.FC = () => {
   const [text, setText] = useState('Dulundu.tools');
   const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

   const styles = [
      { name: 'Bold (Serif)', transform: (s: string) => s.replace(/[A-Za-z0-9]/g, c => "𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳".charAt("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c))) },
      { name: 'Italic (Serif)', transform: (s: string) => s.replace(/[A-Za-z]/g, c => "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠ᴛ𝑢𝑣𝑤𝑥𝑦𝑧".charAt("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c))) },
      { name: 'Monospace', transform: (s: string) => s.replace(/[A-Za-z0-9]/g, c => "𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝑔𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣".charAt("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c))) },
      { name: 'Script', transform: (s: string) => s.replace(/[A-Za-z]/g, c => "𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏".charAt("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c))) },
      { name: 'Double Struck', transform: (s: string) => s.replace(/[A-Za-z0-9]/g, c => "𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫".charAt("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c))) },
      { name: 'Bubbles', transform: (s: string) => s.replace(/[A-Za-z0-9]/g, c => "⓪①②③④⑤⑥⑦⑧⑨ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ".charAt("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c))) },
      { name: 'Upside Down', transform: (s: string) => s.split('').reverse().join('').replace(/[a-zA-Z0-9]/g, c => "zʎxʍʌnʇsɹbdouɯlʞɾıɥƃɟǝpɔqɐZ⅄XMΛ∩⊥SᴚΌԀONW˥➦ſIHפℲƎpƆq∀68ㄥ9ϛㄣƐᘔƖ0".charAt("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".indexOf(c))) },
   ];

   const handleCopy = (text: string, index: number) => {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
   };

   return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

            <ToolHeader
               icon={Type}
               title="Text Styler"
               description="Generate fancy Unicode text for social media"
            />

            <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 flex flex-col">
               <div className="mb-6">
                  <input
                     type="text"
                     value={text}
                     onChange={(e) => setText(e.target.value)}
                     placeholder="Type your text here..."
                     className="w-full p-4 text-lg border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white shadow-sm"
                  />
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="grid gap-4">
                     {styles.map((style, index) => {
                        const styledText = style.transform(text || 'Sample Text');
                        return (
                           <div key={style.name} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary/50 hover:shadow-sm transition-all group">
                              <div>
                                 <p className="text-xs text-slate-400 font-medium uppercase mb-1">{style.name}</p>
                                 <p className="text-lg text-slate-800 font-medium break-all">{styledText}</p>
                              </div>
                              <button
                                 onClick={() => handleCopy(styledText, index)}
                                 className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
                                 title="Copy"
                              >
                                 {copiedIndex === index ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                              </button>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};