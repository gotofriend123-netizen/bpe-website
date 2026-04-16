# SEO Audit Skill

This skill enables the AI to perform comprehensive SEO audits using the `seomator` tool.

## Capabilities
- Perform a deep SEO audit on any URL (local or live).
- Analyze 251+ SEO rules across 20 categories.
- Check Core Web Vitals (LCP, CLS, INP, etc.).
- Inspect JavaScript rendering issues.
- Generate reports in Console, JSON, HTML, or Markdown formats.

## Usage Guide

### 1. Basic Audit
Run an audit on a single URL:
```bash
export PATH=$PATH:/usr/local/bin && npx seomator audit <URL>
```

### 2. Full Site Crawl
Audit multiple pages (e.g., up to 20 pages):
```bash
export PATH=$PATH:/usr/local/bin && npx seomator audit <URL> --crawl --max-pages 20
```

### 3. Generate HTML Report
```bash
export PATH=$PATH:/usr/local/bin && npx seomator audit <URL> --format html -o artifacts/seo-report.html
```

### 4. LLM Optimized Output
For deep analysis of the results:
```bash
export PATH=$PATH:/usr/local/bin && npx seomator audit <URL> --format llm
```

## Categories Covered
- **Core:** Title, Description, H1s, Canonical URLs.
- **Performance:** Core Web Vitals, DOM size, Minification.
- **Links:** Broken links, Redirect chains, Orphan pages.
- **Images:** Alt text, Responsive dimensions, Modern formats.
- **Security:** HTTPS, CSP headers, Mixed content.
- **Technical:** Robots.txt, Sitemap, URL structure.
- **Structured Data:** JSON-LD validation.
- **JavaScript:** Raw vs Rendered comparison.
