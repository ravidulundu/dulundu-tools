import React, { useState, useEffect } from "react";
import { ArrowRightLeft, Copy, Check, Trash2 } from "lucide-react";
import { ToolHeader } from "../components/common/ToolHeader";
import { CodeEditor } from "../components/common/CodeEditor";
import { ActionButton } from "../components/common/ActionButton";

export const ListComparator: React.FC = () => {
  const [listA, setListA] = useState("Apple\nBanana\nCherry\nDate");
  const [listB, setListB] = useState("Banana\nDate\nElderberry\nFig");

  const [aOnly, setAOnly] = useState<string[]>([]);
  const [bOnly, setBOnly] = useState<string[]>([]);
  const [intersection, setIntersection] = useState<string[]>([]);
  const [union, setUnion] = useState<string[]>([]);

  useEffect(() => {
    compare();
  }, [listA, listB]);

  const compare = () => {
    const setA = new Set(
      listA
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    );
    const setB = new Set(
      listB
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    );

    const intersectionRes = [...setA].filter((x) => setB.has(x));
    const aOnlyRes = [...setA].filter((x) => !setB.has(x));
    const bOnlyRes = [...setB].filter((x) => !setA.has(x));
    const unionRes = Array.from(new Set([...setA, ...setB]));

    setIntersection(intersectionRes.sort());
    setAOnly(aOnlyRes.sort());
    setBOnly(bOnlyRes.sort());
    setUnion(unionRes.sort());
  };

  const handleClear = () => {
    setListA("");
    setListB("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={ArrowRightLeft}
          title="List Comparator"
          description="Compare two lists (Intersection, Union, Difference)"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-end">
          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden grid md:grid-cols-3 bg-gray-50/30">
          {/* Inputs Column */}
          <div className="col-span-1 p-4 md:p-6 border-r border-gray-200 flex flex-col gap-4 overflow-y-auto">
            <div className="flex-1 flex flex-col min-h-[200px]">
              <CodeEditor
                value={listA}
                onChange={setListA}
                label="List A"
                placeholder="One item per line..."
                theme="light"
              />
            </div>
            <div className="flex-1 flex flex-col min-h-[200px]">
              <CodeEditor
                value={listB}
                onChange={setListB}
                label="List B"
                placeholder="One item per line..."
                theme="light"
              />
            </div>
          </div>

          {/* Results Column */}
          <div className="col-span-2 p-4 md:p-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 h-full">
              <ResultBox
                title="A ∩ B (Intersection)"
                count={intersection.length}
                data={intersection}
              />
              <ResultBox
                title="A ∪ B (Union)"
                count={union.length}
                data={union}
              />
              <ResultBox
                title="A Only (A - B)"
                count={aOnly.length}
                data={aOnly}
              />
              <ResultBox
                title="B Only (B - A)"
                count={bOnly.length}
                data={bOnly}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultBox: React.FC<{ title: string; count: number; data: string[] }> = ({
  title,
  count,
  data,
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(data.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full min-h-[200px]">
      <CodeEditor
        value={data.join("\n")}
        label={`${title} (${count})`}
        readOnly
        theme="dark"
        actions={
          data.length > 0 && (
            <ActionButton
              icon={copied ? Check : Copy}
              label={copied ? "Copied" : "Copy"}
              onClick={handleCopy}
              variant={copied ? "success" : "primary"}
              size="sm"
            />
          )
        }
      />
    </div>
  );
};
