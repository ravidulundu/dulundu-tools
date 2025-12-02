import React from "react";

// Helper to lazy load named exports
const lazyLoad = (importPath: () => Promise<any>, componentName: string) => {
  return React.lazy(() =>
    importPath().then((module) => ({ default: module[componentName] }))
  );
};

// Tool Components
const JsonFormatter = lazyLoad(
  () => import("./features/JsonFormatter"),
  "JsonFormatter"
);
const Base64Converter = lazyLoad(
  () => import("./features/Base64Converter"),
  "Base64Converter"
);
const AiAssistant = lazyLoad(
  () => import("./features/AiAssistant"),
  "AiAssistant"
);
const ComingSoon = lazyLoad(
  () => import("./features/ComingSoon"),
  "ComingSoon"
);
const PrivacyPolicy = lazyLoad(
  () => import("./features/PrivacyPolicy"),
  "PrivacyPolicy"
);
const TermsOfService = lazyLoad(
  () => import("./features/TermsOfService"),
  "TermsOfService"
);
const WordCounter = lazyLoad(
  () => import("./features/WordCounter"),
  "WordCounter"
);
const UuidGenerator = lazyLoad(
  () => import("./features/UuidGenerator"),
  "UuidGenerator"
);
const LoremGenerator = lazyLoad(
  () => import("./features/LoremGenerator"),
  "LoremGenerator"
);
const UrlEncoder = lazyLoad(
  () => import("./features/UrlEncoder"),
  "UrlEncoder"
);
const ColorConverter = lazyLoad(
  () => import("./features/ColorConverter"),
  "ColorConverter"
);
const CodeMinifier = lazyLoad(
  () => import("./features/CodeMinifier"),
  "CodeMinifier"
);
const HashGenerator = lazyLoad(
  () => import("./features/HashGenerator"),
  "HashGenerator"
);
const DiffViewer = lazyLoad(
  () => import("./features/DiffViewer"),
  "DiffViewer"
);
const PasswordGenerator = lazyLoad(
  () => import("./features/PasswordGenerator"),
  "PasswordGenerator"
);
const ImageConverter = lazyLoad(
  () => import("./features/ImageConverter"),
  "ImageConverter"
);
const UnitConverter = lazyLoad(
  () => import("./features/UnitConverter"),
  "UnitConverter"
);
const NumberConverter = lazyLoad(
  () => import("./features/NumberConverter"),
  "NumberConverter"
);
const SqlFormatter = lazyLoad(
  () => import("./features/SqlFormatter"),
  "SqlFormatter"
);
const GradientGenerator = lazyLoad(
  () => import("./features/GradientGenerator"),
  "GradientGenerator"
);
const HtmlTableGenerator = lazyLoad(
  () => import("./features/HtmlTableGenerator"),
  "HtmlTableGenerator"
);
const TextStyler = lazyLoad(
  () => import("./features/TextStyler"),
  "TextStyler"
);
const EscapeTools = lazyLoad(
  () => import("./features/EscapeTools"),
  "EscapeTools"
);
const MarkdownTools = lazyLoad(
  () => import("./features/MarkdownTools"),
  "MarkdownTools"
);
const XmlFormatter = lazyLoad(
  () => import("./features/XmlFormatter"),
  "XmlFormatter"
);
const CsvConverter = lazyLoad(
  () => import("./features/CsvConverter"),
  "CsvConverter"
);
const LoanCalculator = lazyLoad(
  () => import("./features/LoanCalculator"),
  "LoanCalculator"
);

// Recently Added Components
const MyIp = lazyLoad(() => import("./features/MyIp"), "MyIp");
const CssUnitConverter = lazyLoad(
  () => import("./features/CssUnitConverter"),
  "CssUnitConverter"
);
const CodeFormatter = lazyLoad(
  () => import("./features/CodeFormatter"),
  "CodeFormatter"
);
const TwitterCardGenerator = lazyLoad(
  () => import("./features/TwitterCardGenerator"),
  "TwitterCardGenerator"
);
const JsonConverter = lazyLoad(
  () => import("./features/JsonConverter"),
  "JsonConverter"
);
const GstCalculator = lazyLoad(
  () => import("./features/GstCalculator"),
  "GstCalculator"
);
const HtmlStripper = lazyLoad(
  () => import("./features/HtmlStripper"),
  "HtmlStripper"
);
const RandomGenerator = lazyLoad(
  () => import("./features/RandomGenerator"),
  "RandomGenerator"
);
const TsvConverter = lazyLoad(
  () => import("./features/TsvConverter"),
  "TsvConverter"
);
const SqlConverter = lazyLoad(
  () => import("./features/SqlConverter"),
  "SqlConverter"
);

// Batch 3
const XmlJsonConverter = lazyLoad(
  () => import("./features/XmlJsonConverter"),
  "XmlJsonConverter"
);
const DnsLookup = lazyLoad(() => import("./features/DnsLookup"), "DnsLookup");
const PojoGenerator = lazyLoad(
  () => import("./features/PojoGenerator"),
  "PojoGenerator"
);
const Utf8Converter = lazyLoad(
  () => import("./features/Utf8Converter"),
  "Utf8Converter"
);
const CsvXmlConverter = lazyLoad(
  () => import("./features/CsvXmlConverter"),
  "CsvXmlConverter"
);

// Batch 4
const JwtDecoder = lazyLoad(
  () => import("./features/JwtDecoder"),
  "JwtDecoder"
);
const GzipCompressor = lazyLoad(
  () => import("./features/GzipCompressor"),
  "GzipCompressor"
);
const QrcodeGenerator = lazyLoad(
  () => import("./features/QrcodeGenerator"),
  "QrcodeGenerator"
);
const ChmodCalculator = lazyLoad(
  () => import("./features/ChmodCalculator"),
  "ChmodCalculator"
);
const CronGenerator = lazyLoad(
  () => import("./features/CronGenerator"),
  "CronGenerator"
);

// Batch 5
const YamlConverter = lazyLoad(
  () => import("./features/YamlConverter"),
  "YamlConverter"
);
const WhoisLookup = lazyLoad(
  () => import("./features/WhoisLookup"),
  "WhoisLookup"
);
const JsValidator = lazyLoad(
  () => import("./features/JsValidator"),
  "JsValidator"
);

// Batch 6
const RegexTester = lazyLoad(
  () => import("./features/RegexTester"),
  "RegexTester"
);
const DateConverter = lazyLoad(
  () => import("./features/DateConverter"),
  "DateConverter"
);
const ListComparator = lazyLoad(
  () => import("./features/ListComparator"),
  "ListComparator"
);
const TextCaseConverter = lazyLoad(
  () => import("./features/TextCaseConverter"),
  "TextCaseConverter"
);
const UaParser = lazyLoad(() => import("./features/UaParser"), "UaParser");

// Batch 7
const MarkdownEditor = lazyLoad(
  () => import("./features/MarkdownEditor"),
  "MarkdownEditor"
);
const BitwiseCalculator = lazyLoad(
  () => import("./features/BitwiseCalculator"),
  "BitwiseCalculator"
);
const BcryptGenerator = lazyLoad(
  () => import("./features/BcryptGenerator"),
  "BcryptGenerator"
);
const HmacGenerator = lazyLoad(
  () => import("./features/HmacGenerator"),
  "HmacGenerator"
);
const SlugGenerator = lazyLoad(
  () => import("./features/SlugGenerator"),
  "SlugGenerator"
);

// Batch 8 (Final)
const RsaGenerator = lazyLoad(
  () => import("./features/RsaGenerator"),
  "RsaGenerator"
);
const TokenGenerator = lazyLoad(
  () => import("./features/TokenGenerator"),
  "TokenGenerator"
);
const HttpStatusCodes = lazyLoad(
  () => import("./features/HttpStatusCodes"),
  "HttpStatusCodes"
);
const MetaTagGenerator = lazyLoad(
  () => import("./features/MetaTagGenerator"),
  "MetaTagGenerator"
);
const PaletteExtractor = lazyLoad(
  () => import("./features/PaletteExtractor"),
  "PaletteExtractor"
);

// Batch 9 (New Requests)
const NumberSorter = lazyLoad(
  () => import("./features/NumberSorter"),
  "NumberSorter"
);
const RemovePunctuation = lazyLoad(
  () => import("./features/RemovePunctuation"),
  "RemovePunctuation"
);
const HtmlEditor = lazyLoad(
  () => import("./features/HtmlEditor"),
  "HtmlEditor"
);
const LuaMinifier = lazyLoad(
  () => import("./features/LuaMinifier"),
  "LuaMinifier"
);
const LuaBeautifier = lazyLoad(
  () => import("./features/LuaBeautifier"),
  "LuaBeautifier"
);
const PhpFormatter = lazyLoad(
  () => import("./features/PhpFormatter"),
  "PhpFormatter"
);
const WordpressPasswordHash = lazyLoad(
  () => import("./features/WordpressPasswordHash"),
  "WordpressPasswordHash"
);
const ImageToAscii = lazyLoad(
  () => import("./features/ImageToAscii"),
  "ImageToAscii"
);
const ExcelViewer = lazyLoad(
  () => import("./features/ExcelViewer"),
  "ExcelViewer"
);
const CsvToExcel = lazyLoad(
  () => import("./features/CsvToExcel"),
  "CsvToExcel"
);
const ParaphrasingTool = lazyLoad(
  () => import("./features/ParaphrasingTool"),
  "ParaphrasingTool"
);
const MirrorOnline = lazyLoad(
  () => import("./features/MirrorOnline"),
  "MirrorOnline"
);
const WordToHtml = lazyLoad(
  () => import("./features/WordToHtml"),
  "WordToHtml"
);
const SharelinkGenerator = lazyLoad(
  () => import("./features/SharelinkGenerator"),
  "SharelinkGenerator"
);
const ReadmeGenerator = lazyLoad(
  () => import("./features/ReadmeGenerator/index"),
  "ReadmeGenerator"
);
const SvgViewer = lazyLoad(
  () => import("./features/SvgViewer/index"),
  "SvgViewer"
);

// Home Component
const Home = lazyLoad(() => import("./features/Home"), "Home");
const NotFound = lazyLoad(() => import("./features/NotFound"), "NotFound");

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/json-formatter", element: <JsonFormatter /> },
  { path: "/base64-converter", element: <Base64Converter /> },
  { path: "/ai-assistant", element: <AiAssistant /> },
  { path: "/word-counter", element: <WordCounter /> },
  { path: "/uuid-generator", element: <UuidGenerator /> },
  { path: "/lorem-ipsum", element: <LoremGenerator /> },
  { path: "/url-encoder", element: <UrlEncoder /> },
  { path: "/color-converter", element: <ColorConverter /> },
  { path: "/code-minifier", element: <CodeMinifier /> },
  { path: "/hash-generator", element: <HashGenerator /> },
  { path: "/diff-viewer", element: <DiffViewer /> },
  { path: "/password-generator", element: <PasswordGenerator /> },
  { path: "/image-converter", element: <ImageConverter /> },
  { path: "/unit-converter", element: <UnitConverter /> },
  { path: "/number-converter", element: <NumberConverter /> },
  { path: "/sql-formatter", element: <SqlFormatter /> },
  { path: "/gradient-generator", element: <GradientGenerator /> },
  { path: "/html-table-generator", element: <HtmlTableGenerator /> },
  { path: "/text-styler", element: <TextStyler /> },
  { path: "/escape-tools", element: <EscapeTools /> },
  { path: "/markdown-tools", element: <MarkdownTools /> },
  { path: "/xml-formatter", element: <XmlFormatter /> },
  { path: "/csv-converter", element: <CsvConverter /> },
  { path: "/loan-calculator", element: <LoanCalculator /> },
  { path: "/my-ip", element: <MyIp /> },
  { path: "/css-unit-converter", element: <CssUnitConverter /> },
  { path: "/code-formatter", element: <CodeFormatter /> },
  { path: "/twitter-card-generator", element: <TwitterCardGenerator /> },
  { path: "/json-converter", element: <JsonConverter /> },
  { path: "/gst-calculator", element: <GstCalculator /> },
  { path: "/html-stripper", element: <HtmlStripper /> },
  { path: "/random-generator", element: <RandomGenerator /> },
  { path: "/tsv-converter", element: <TsvConverter /> },
  { path: "/sql-converter", element: <SqlConverter /> },
  { path: "/xml-json-converter", element: <XmlJsonConverter /> },
  { path: "/dns-lookup", element: <DnsLookup /> },
  { path: "/pojo-generator", element: <PojoGenerator /> },
  { path: "/utf8-converter", element: <Utf8Converter /> },
  { path: "/csv-to-xml", element: <CsvXmlConverter /> },
  { path: "/jwt-decoder", element: <JwtDecoder /> },
  { path: "/gzip-compressor", element: <GzipCompressor /> },
  { path: "/qrcode-generator", element: <QrcodeGenerator /> },
  { path: "/chmod-calculator", element: <ChmodCalculator /> },
  { path: "/cron-generator", element: <CronGenerator /> },
  { path: "/yaml-converter", element: <YamlConverter /> },
  { path: "/whois-lookup", element: <WhoisLookup /> },
  { path: "/js-validator", element: <JsValidator /> },
  { path: "/regex-tester", element: <RegexTester /> },
  { path: "/date-converter", element: <DateConverter /> },
  { path: "/list-comparator", element: <ListComparator /> },
  { path: "/case-converter", element: <TextCaseConverter /> },
  { path: "/ua-parser", element: <UaParser /> },
  { path: "/markdown-editor", element: <MarkdownEditor /> },
  { path: "/bitwise-calculator", element: <BitwiseCalculator /> },
  { path: "/bcrypt-generator", element: <BcryptGenerator /> },
  { path: "/hmac-generator", element: <HmacGenerator /> },
  { path: "/slug-generator", element: <SlugGenerator /> },
  { path: "/rsa-generator", element: <RsaGenerator /> },
  { path: "/token-generator", element: <TokenGenerator /> },
  { path: "/http-status-codes", element: <HttpStatusCodes /> },
  { path: "/meta-tag-generator", element: <MetaTagGenerator /> },
  { path: "/palette-extractor", element: <PaletteExtractor /> },
  { path: "/number-sorter", element: <NumberSorter /> },
  { path: "/remove-punctuation", element: <RemovePunctuation /> },
  { path: "/html-editor", element: <HtmlEditor /> },
  { path: "/lua-minifier", element: <LuaMinifier /> },
  { path: "/lua-beautifier", element: <LuaBeautifier /> },
  { path: "/php-formatter", element: <PhpFormatter /> },
  { path: "/wordpress-password-hash", element: <WordpressPasswordHash /> },
  { path: "/image-to-ascii", element: <ImageToAscii /> },
  { path: "/excel-viewer", element: <ExcelViewer /> },
  { path: "/csv-to-excel", element: <CsvToExcel /> },
  { path: "/paraphrasing-tool", element: <ParaphrasingTool /> },
  { path: "/mirror-online", element: <MirrorOnline /> },
  { path: "/word-to-html", element: <WordToHtml /> },
  { path: "/sharelink-generator", element: <SharelinkGenerator /> },
  { path: "/readme-generator", element: <ReadmeGenerator /> },
  { path: "/coming-soon", element: <ComingSoon /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/terms", element: <TermsOfService /> },
  { path: "/svg-viewer", element: <SvgViewer /> },
  { path: "/s/:id", element: <SvgViewer /> },
  { path: "*", element: <NotFound /> },
];
