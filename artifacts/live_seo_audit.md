# SEO Audit Report

**URL:** [https://blackpepperentertainment.in](https://blackpepperentertainment.in)
**Date:** 4/17/2026, 9:49:52 PM

## Overall Score

| Score | Rating |
|-------|--------|
| **95/100** :white_check_mark: | Excellent |

> :white_check_mark: **Audit passed** (score >= 70)

## Category Breakdown

| Category | Score | Passed | Warnings | Failed |
|----------|-------|--------|----------|--------|
| Core | 100 :white_check_mark: | 19 | 0 | 0 |
| Technical SEO | 100 :white_check_mark: | 13 | 0 | 0 |
| Performance | 87 :yellow_circle: | 10 | 7 | 5 |
| Links | 99 :white_check_mark: | 18 | 1 | 0 |
| Images | 89 :yellow_circle: | 9 | 5 | 0 |
| Security | 98 :white_check_mark: | 15 | 1 | 0 |
| Crawlability | 99 :white_check_mark: | 17 | 1 | 0 |
| Structured Data | 91 :white_check_mark: | 9 | 4 | 0 |
| Accessibility | 95 :white_check_mark: | 10 | 2 | 0 |
| Content | 88 :yellow_circle: | 10 | 6 | 1 |
| Social | 94 :white_check_mark: | 7 | 2 | 0 |
| E\-E\-A\-T | 92 :white_check_mark: | 10 | 4 | 0 |
| URL Structure | 100 :white_check_mark: | 14 | 0 | 0 |
| Mobile | 100 :white_check_mark: | 5 | 0 | 0 |
| Internationalization | 100 :white_check_mark: | 10 | 0 | 0 |
| Legal Compliance | 50 :orange_circle: | 0 | 1 | 0 |
| JavaScript Rendering | 100 :white_check_mark: | 13 | 0 | 0 |
| Redirects | 100 :white_check_mark: | 8 | 0 | 0 |
| HTML Validation | 97 :white_check_mark: | 8 | 1 | 0 |
| AI/GEO Readiness | 94 :white_check_mark: | 4 | 1 | 0 |

## :x: Failures

Found 6 failing checks:

### cwv\-lcp

- **Category:** Performance
- **Status:** :x: Failed
- **Message:** LCP is 4\.56s \(poor, should be under 2\.5s\)
- **Details:**
  - metric: `LCP`
  - value: `4564`
  - valueFormatted: `4\.56s`
  - threshold: `\{"good":2500,"poor":4000\}`
  - pageUrl: `https://blackpepperentertainment\.in`

### cwv\-fcp

- **Category:** Performance
- **Status:** :x: Failed
- **Message:** FCP is 3\.08s \(poor, should be under 1\.8s\)
- **Details:**
  - metric: `FCP`
  - value: `3084`
  - valueFormatted: `3\.08s`
  - threshold: `\{"good":1800,"poor":3000\}`
  - pageUrl: `https://blackpepperentertainment\.in`

### perf\-dom\-size

- **Category:** Performance
- **Status:** :x: Failed
- **Message:** DOM size is too large: 1,754 DOM nodes \(recommended: <800\)
- **Details:**
  - totalNodes: `1754`
  - maxDepth: `15`
  - maxChildren: `32`
  - deepestSelector: `path`
  - widestSelector: `div\.flex`
  - thresholds: `\{"nodes":\{"good":800,"warning":1500\},"depth":\{"good":32,"warning":48\},"children":\{"good":60\}\}`
  - pageUrl: `https://blackpepperentertainment\.in`

### perf\-page\-weight

- **Category:** Performance
- **Status:** :x: Failed
- **Message:** HTML document is 436KB \(recommended: <100KB\) — consider reducing inline content, splitting pages, or lazy loading
- **Details:**
  - htmlBytes: `446101`
  - htmlSize: `436KB`
  - externalScripts: `16`
  - externalStylesheets: `2`
  - imageCount: `43`
  - thresholds: `\{"good":"100KB","warning":"300KB"\}`
  - pageUrl: `https://blackpepperentertainment\.in`

### perf\-js\-file\-size

- **Category:** Performance
- **Status:** :x: Failed
- **Message:** Total inline JavaScript is 168KB across 12 script\(s\) \(recommended: <50KB\) — externalize large scripts for caching
- **Details:**
  - totalBytes: `171768`
  - totalSize: `168KB`
  - inlineScriptCount: `12`
  - largestScriptBytes: `159293`
  - largestScriptSize: `156KB`
  - thresholds: `\{"good":"50KB","warning":"150KB"\}`
  - pageUrl: `https://blackpepperentertainment\.in`

### content\-description\-pixel\-width

- **Category:** Content
- **Status:** :x: Failed
- **Message:** Meta description will be truncated in SERP: estimated 1110px \(max ~920px\)
- **Details:**
  - description: `Book The Arcade community hall, Verve Studio, and curated events with Black Pepper Entertainment\.\.\.\.`
  - estimatedWidth: `1110`
  - characterCount: `157`
  - thresholds: `\{"good":920,"warn":990\}`
  - impact: `Truncated descriptions lose the call\-to\-action and may reduce click\-through rates`
  - recommendation: `Shorten the description to fit within 920px \(~155 characters\)\. Place the most compelling informat\.\.\.`
  - pageUrl: `https://blackpepperentertainment\.in`

## :warning: Warnings

Found 36 warnings:

### cwv\-inp

- **Category:** Performance
- **Status:** :warning: Warning
- **Message:** Could not measure Interaction to Next Paint \(no user interaction detected or metric not available\)
- **Details:**
  - metric: `INP`
  - reason: `No interaction or metric not available`
  - pageUrl: `https://blackpepperentertainment\.in`

### perf\-preconnect

- **Category:** Performance
- **Status:** :warning: Warning
- **Message:** Missing preconnect for 1 critical origin\(s\): https://www\.googletagmanager\.com
- **Details:**
  - preconnects: `\[\]`
  - dnsPrefetches: `\[\]`
  - thirdPartyOrigins: `\["https://www\.googletagmanager\.com"\]`
  - missingPreconnects: `\["https://www\.googletagmanager\.com"\]`
  - criticalOrigins: `\["fonts\.googleapis\.com","fonts\.gstatic\.com","www\.google\-analytics\.com","www\.googletagmanager\.com"\.\.\.`
  - pageUrl: `https://blackpepperentertainment\.in`

### perf\-render\-blocking

- **Category:** Performance
- **Status:** :warning: Warning
- **Message:** Render\-blocking resources found: 1 script\(s\) in <head> without async/defer
- **Details:**
  - blockingScripts: `\[\{"src":"/\_next/static/chunks/polyfills\-42372ed130431b0a\.js","inHead":true\}\]`
  - inlineScriptsInHead: `0`
  - largeInlineScripts: `\[\]`
  - potentiallyBlockingCss: `\["/\_next/static/css/27b4d6b789fddb24\.css","/\_next/static/css/da331d3ca86f3978\.css"\]`
  - asyncScripts: `15`
  - deferScripts: `0`
  - moduleScripts: `0`
  - pageUrl: `https://blackpepperentertainment\.in`

### perf\-lcp\-hints

- **Category:** Performance
- **Status:** :warning: Warning
- **Message:** LCP candidate \(header img\) could be optimized: missing preload
- **Details:**
  - candidate: `\{"type":"image","element":"header img","src":"/\_next/image?url=%2FBLACK%20PEPPER%20LOGO%20%20WIGH\.\.\.`
  - preloadedImages: `\["/the\-arcade/dsc02541\.jpg","/verve\-studio/dsc02518\.jpg","/the\-arcade/dsc02553\.jpg","/verve\-studi\.\.\.`
  - hasAnyOptimization: `true`
  - pageUrl: `https://blackpepperentertainment\.in`

### perf\-minify\-css

- **Category:** Performance
- **Status:** :warning: Warning
- **Message:** Inline CSS appears unminified \(1679 bytes, ~37% whitespace\) — minification could save ~616 bytes
- **Details:**
  - styleTagCount: `2`
  - totalBytes: `1679`
  - thresholds: `\{"minBytesToCheck":500,"whitespaceRatio":0\.15\}`
  - whitespaceRatio: `0\.367`
  - estimatedSavingsBytes: `616`
  - pageUrl: `https://blackpepperentertainment\.in`

### perf\-response\-time

- **Category:** Performance
- **Status:** :warning: Warning
- **Message:** Response time is 735ms \(recommended: <500ms\) — may impact user experience
- **Details:**
  - responseTimeMs: `735`
  - thresholds: `\{"good":500,"warning":1000\}`
  - pageUrl: `https://blackpepperentertainment\.in`

### perf\-http2

- **Category:** Performance
- **Status:** :warning: Warning
- **Message:** No alt\-svc header found — server may not support HTTP/2 or HTTP/3 \(informational\)
- **Details:**
  - altSvc: `not set`
  - pageUrl: `https://blackpepperentertainment\.in`

### links\-anchor\-text

- **Category:** Links
- **Status:** :warning: Warning
- **Message:** Found 2 link\(s\) with non\-descriptive anchor text \(3\.4% of all links\)
- **Details:**
  - issueCount: `2`
  - totalLinks: `59`
  - issues: `\[\{"href":"https://blackpepperentertainment\.in/","text":"","issue":"Empty anchor text"\},\{"href":"h\.\.\.`
  - suggestion: `Use descriptive anchor text that tells users and search engines what the linked page is about`
  - pageUrl: `https://blackpepperentertainment\.in`

### images\-dimensions

- **Category:** Images
- **Status:** :warning: Warning
- **Message:** Found 41 image\(s\) missing width and/or height attributes \(95\.3% of images\)
- **Details:**
  - issueCount: `41`
  - totalImages: `43`
  - missingBothCount: `41`
  - missingWidthOnlyCount: `0`
  - missingHeightOnlyCount: `0`
  - images: `\[\{"src":"https://blackpepperentertainment\.in/the\-arcade/dsc02541\.jpg","hasWidth":false,"hasHeight\.\.\.`
  - suggestion: `Add explicit width and height attributes to images to prevent Cumulative Layout Shift \(CLS\)`
  - pageUrl: `https://blackpepperentertainment\.in`

### images\-lazy\-loading

- **Category:** Images
- **Status:** :warning: Warning
- **Message:** Found 10 below\-fold image\(s\) not using lazy loading \(25\.0%\)
- **Details:**
  - notLazyLoadedCount: `10`
  - belowFoldCount: `40`
  - totalImages: `43`
  - images: `\[\{"src":"https://blackpepperentertainment\.in/the\-arcade/dsc02553\.jpg"\},\{"src":"https://blackpeppe\.\.\.`
  - suggestion: `Add loading="lazy" to images below the fold to improve initial page load performance`
  - pageUrl: `https://blackpepperentertainment\.in`

### images\-modern\-format

- **Category:** Images
- **Status:** :warning: Warning
- **Message:** No modern image formats detected \(0% WebP/AVIF usage\)
- **Details:**
  - legacyImageCount: `10`
  - modernImageCount: `0`
  - pictureElements: `0`
  - formatBreakdown: `\{"in/\_next/image":33,"jpg":10\}`
  - legacyImages: `\[\{"src":"https://blackpepperentertainment\.in/the\-arcade/dsc02541\.jpg","format":"jpg"\},\{"src":"htt\.\.\.`
  - suggestion: `Convert images to WebP or AVIF format for 25\-50% smaller file sizes`
  - pageUrl: `https://blackpepperentertainment\.in`

### images\-responsive

- **Category:** Images
- **Status:** :warning: Warning
- **Message:** Found 42 image\(s\) not using responsive techniques \(97\.7%\)
- **Details:**
  - nonResponsiveCount: `42`
  - totalImages: `43`
  - pictureElements: `0`
  - imagesWithSrcset: `33`
  - imagesWithSizes: `31`
  - images: `\[\{"src":"https://blackpepperentertainment\.in/the\-arcade/dsc02541\.jpg"\},\{"src":"https://blackpeppe\.\.\.`
  - suggestion: `Consider adding srcset or picture element for larger images to improve performance on various dev\.\.\.`
  - pageUrl: `https://blackpepperentertainment\.in`

### images\-filename\-quality

- **Category:** Images
- **Status:** :warning: Warning
- **Message:** Found 10 image\(s\) with non\-descriptive filenames \(23\.3%\)
- **Details:**
  - poorFilenameCount: `10`
  - totalImages: `43`
  - images: `\[\{"src":"https://blackpepperentertainment\.in/the\-arcade/dsc02541\.jpg","filename":"dsc02541\.jpg","\.\.\.`
  - suggestion: `Use descriptive filenames like "red\-running\-shoes\.jpg" instead of "IMG\_001\.jpg"`
  - pageUrl: `https://blackpepperentertainment\.in`

### security\-csp

- **Category:** Security
- **Status:** :warning: Warning
- **Message:** Content\-Security\-Policy is present but missing recommended directives: default\-src, script\-src, style\-src, img\-src
- **Details:**
  - url: `https://blackpepperentertainment\.in`
  - headerValue: `frame\-ancestors 'none';`
  - directives: `\["frame\-ancestors"\]`
  - missingRecommended: `\["default\-src","script\-src","style\-src","img\-src"\]`
  - hasReportOnly: `false`
  - pageUrl: `https://blackpepperentertainment\.in`

### crawl\-sitemap\-orphan\-urls

- **Category:** Crawlability
- **Status:** :warning: Warning
- **Message:** 6 sitemap URL\(s\) \(30\.0%\) are not linked from any crawled page
- **Details:**
  - crawledUrlCount: `25`
  - sitemapUrlCount: `20`
  - orphanCount: `6`
  - orphanUrls: `\["https://blackpepperentertainment\.in/host\-an\-event","https://blackpepperentertainment\.in/legal/r\.\.\.`
  - impact: `Orphan pages lack internal links, reducing discoverability and crawl priority`
  - recommendation: `Add internal links to orphan pages or remove them from the sitemap if obsolete`
  - pageUrl: `https://blackpepperentertainment\.in`

### schema\-required\-fields

- **Category:** Structured Data
- **Status:** :warning: Warning
- **Message:** All required fields present, but 8 recommended field\(s\) missing
- **Details:**
  - typesChecked: `3`
  - totalMissingRequired: `0`
  - totalMissingRecommended: `8`
  - recommendations: `\["Organization: consider adding contactPoint, sameAs, address","WebSite: consider adding potentia\.\.\.`
  - validations: `\[\{"type":"Organization","missingRequired":\[\],"missingRecommended":\["contactPoint","sameAs","addre\.\.\.`
  - pageUrl: `https://blackpepperentertainment\.in`

### schema\-local\-business

- **Category:** Structured Data
- **Status:** :warning: Warning
- **Message:** LocalBusiness schema has warnings: LocalBusiness: address missing fields: streetAddress; LocalBusiness: missing recommended fields: openingHours, geo, priceRange, url
- **Details:**
  - businessesFound: `1`
  - warnings: `\["LocalBusiness: address missing fields: streetAddress","LocalBusiness: missing recommended field\.\.\.`
  - pageUrl: `https://blackpepperentertainment\.in`

### schema\-organization

- **Category:** Structured Data
- **Status:** :warning: Warning
- **Message:** Organization schema valid with suggestions
- **Details:**
  - orgCount: `1`
  - warnings: `\["logo should be absolute URL","consider adding sameAs with social media profiles","consider addi\.\.\.`
  - pageUrl: `https://blackpepperentertainment\.in`

### schema\-website\-search

- **Category:** Structured Data
- **Status:** :warning: Warning
- **Message:** WebSite found but no SearchAction for sitelinks searchbox
- **Details:**
  - websiteCount: `1`
  - hasSearchAction: `false`
  - suggestion: `Add potentialAction with SearchAction for sitelinks searchbox eligibility`
  - pageUrl: `https://blackpepperentertainment\.in`

### a11y\-heading\-order

- **Category:** Accessibility
- **Status:** :warning: Warning
- **Message:** Found 1 heading hierarchy issue\(s\)
- **Details:**
  - issues: `\["First heading is H3, should be H1"\]`
  - totalHeadings: `80`
  - skips: `\[\]`
  - pageUrl: `https://blackpepperentertainment\.in`

### a11y\-link\-text

- **Category:** Accessibility
- **Status:** :warning: Warning
- **Message:** Found 3 link text accessibility issue\(s\)
- **Details:**
  - genericLinks: `\[\]`
  - duplicates: `\[\{"text":"book now","count":4\},\{"text":"view space details","count":4\},\{"text":"view pricing","co\.\.\.`
  - totalLinks: `58`
  - issues: `\["\\"book now\\" used 4 times for different destinations","\\"view space details\\" used 4 times for \.\.\.`
  - pageUrl: `https://blackpepperentertainment\.in`

### content\-reading\-level

- **Category:** Content
- **Status:** :warning: Warning
- **Message:** Content may be too complex: 16\.7 \(Very Difficult \(college graduate\)\)
- **Details:**
  - score: `16\.7`
  - levelDescription: `Very Difficult \(college graduate\)`
  - wordCount: `1140`
  - sentenceCount: `57`
  - avgWordsPerSentence: `20`
  - thresholds: `\{"optimal":\{"min":60,"max":70\},"acceptable":\{"min":50,"max":80\}\}`
  - impact: `Complex content may alienate general audiences and reduce engagement`
  - recommendation: `Simplify language by: using shorter sentences, replacing jargon with common words, breaking long \.\.\.`
  - note: `Technical content for expert audiences may legitimately score lower\.`
  - pageUrl: `https://blackpepperentertainment\.in`

### content\-article\-links

- **Category:** Content
- **Status:** :warning: Warning
- **Message:** Link density too high: 5\.18 links per 100 words \(maximum 5\)
- **Details:**
  - wordCount: `1140`
  - totalLinks: `59`
  - internalLinks: `59`
  - externalLinks: `0`
  - linksPer100Words: `5\.18`
  - thresholds: `\{"min":0\.5,"max":5\}`
  - impact: `Excessive linking can appear spammy and dilute page authority`
  - recommendation: `Remove less relevant links\. Focus on quality over quantity \- each link should provide clear value\.\.\.`
  - pageUrl: `https://blackpepperentertainment\.in`

### content\-broken\-html

- **Category:** Content
- **Status:** :warning: Warning
- **Message:** HTML structure issues found: 1 problem
- **Details:**
  - issueCount: `1`
  - criticalCount: `1`
  - minorCount: `0`
  - issues: `\[\{"type":"invalid\-nesting","element":"<a> > <div>","details":"Block element <div> inside inline e\.\.\.`
  - categories: `\{"duplicate\-id":0,"invalid\-nesting":1,"missing\-attribute":0,"empty\-element":0,"accessibility":0,"\.\.\.`
  - impact: `Minor HTML issues may affect accessibility or cause subtle rendering problems`
  - recommendation: `Review and fix the identified issues\. Modern browsers are forgiving, but search engine parsers ma\.\.\.`
  - pageUrl: `https://blackpepperentertainment\.in`

### content\-heading\-hierarchy

- **Category:** Content
- **Status:** :warning: Warning
- **Message:** Heading hierarchy issues found: 1 problem\(s\)
- **Details:**
  - issues: `\["Document should start with an <h1>, but starts with <h3>"\]`
  - headingCount: `80`
  - structure: `\[\{"level":3,"text":"Quick FAQs before you book\."\},\{"level":2,"text":"Frequently asked questions"\}\.\.\.`
  - pageUrl: `https://blackpepperentertainment\.in`

### content\-heading\-length

- **Category:** Content
- **Status:** :warning: Warning
- **Message:** Heading length issues: 6 too short \(<10 chars\), 1 too long \(>70 chars\)
- **Details:**
  - headingCount: `80`
  - issueCount: `7`
  - tooShort: `6`
  - tooLong: `1`
  - issues: `\[\{"level":3,"text":"David Kim","length":9,"issue":"too\-short"\},\{"level":3,"text":"David Kim","len\.\.\.`
  - minLength: `10`
  - maxLength: `70`
  - pageUrl: `https://blackpepperentertainment\.in`

### content\-heading\-unique

- **Category:** Content
- **Status:** :warning: Warning
- **Message:** Found 23 duplicate heading text\(s\) \(50 total occurrences\)
- **Details:**
  - uniqueHeadings: `53`
  - duplicateCount: `23`
  - duplicates: `\[\{"text":"sarah chen","count":2,"levels":\[3,3\]\},\{"text":"marcus johnson","count":2,"levels":\[3,3\]\.\.\.`
  - pageUrl: `https://blackpepperentertainment\.in`

### social\-share\-buttons

- **Category:** Social
- **Status:** :warning: Warning
- **Message:** No social sharing buttons detected\. Add share buttons to encourage social engagement
- **Details:**
  - hasShareButtons: `false`
  - platformCount: `0`
  - suggestion: `Add share buttons for Facebook, Twitter/X, and LinkedIn`
  - pageUrl: `https://blackpepperentertainment\.in`

### social\-profiles

- **Category:** Social
- **Status:** :warning: Warning
- **Message:** No social media profile links found\. Add links to your social profiles in header/footer
- **Details:**
  - hasProfiles: `false`
  - profileCount: `0`
  - suggestion: `Add social profile links in header/footer and include sameAs in Organization schema`
  - pageUrl: `https://blackpepperentertainment\.in`

### eeat\-author\-byline

- **Category:** E\-E\-A\-T
- **Status:** :warning: Warning
- **Message:** No author byline found
- **Details:**
  - signals: `\[\]`
  - recommendation: `Add author attribution using Schema\.org Person markup, meta author tag, or visible byline`
  - impact: `Missing author info can negatively impact E\-E\-A\-T signals, especially for YMYL content`
  - pageUrl: `https://blackpepperentertainment\.in`

### eeat\-author\-expertise

- **Category:** E\-E\-A\-T
- **Status:** :warning: Warning
- **Message:** No author present \- expertise check not applicable
- **Details:**
  - signals: `\[\]`
  - note: `This check requires author attribution\. See eeat\-author\-byline rule\.`
  - pageUrl: `https://blackpepperentertainment\.in`

### eeat\-content\-dates

- **Category:** E\-E\-A\-T
- **Status:** :warning: Warning
- **Message:** No content date signals found
- **Details:**
  - signals: `\[\]`
  - recommendation: `Add datePublished and dateModified to Article schema, or use <time> elements with datetime attrib\.\.\.`
  - impact: `Search engines use date signals to assess content freshness, which can affect rankings for time\-s\.\.\.`
  - pageUrl: `https://blackpepperentertainment\.in`

### eeat\-editorial\-policy

- **Category:** E\-E\-A\-T
- **Status:** :warning: Warning
- **Message:** No editorial policy found \- recommended for content\-focused sites
- **Details:**
  - hasEditorialPolicy: `false`
  - signals: `\[\]`
  - isContentSite: `true`
  - recommendation: `Add an editorial policy page explaining your content creation, review, and correction processes`
  - pageUrl: `https://blackpepperentertainment\.in`

### legal\-cookie\-consent

- **Category:** Legal Compliance
- **Status:** :warning: Warning
- **Message:** No cookie consent mechanism detected \(tracking scripts present\)
- **Details:**
  - hasConsent: `false`
  - hasTracking: `true`
  - issues: `\["Tracking scripts detected but no cookie consent mechanism found"\]`
  - pageUrl: `https://blackpepperentertainment\.in`

### htmlval\-size\-limit

- **Category:** HTML Validation
- **Status:** :warning: Warning
- **Message:** HTML document is 435\.6 KB\. Consider keeping it under 250 KB for optimal performance
- **Details:**
  - sizeBytes: `446101`
  - sizeFormatted: `435\.6 KB`
  - threshold: `250 KB`
  - pageUrl: `https://blackpepperentertainment\.in`

### geo\-llms\-txt

- **Category:** AI/GEO Readiness
- **Status:** :warning: Warning
- **Message:** No llms\.txt reference found \- consider adding for AI discoverability
- **Details:**
  - references: `\[\]`
  - referenceCount: `0`
  - note: `llms\.txt is an emerging standard \(llmstxt\.org\) \- not yet required but recommended for AI visibility`
  - recommendation: `Add <link rel="llms" href="/llms\.txt"> in <head>, or create /llms\.txt describing your site for LL\.\.\.`
  - pageUrl: `https://blackpepperentertainment\.in`

## Summary

| Metric | Count |
|--------|-------|
| Total Checks | 251 |
| :white_check_mark: Passed | 209 |
| :warning: Warnings | 36 |
| :x: Failures | 6 |

---

*Generated by [SEOmator CLI](https://www.npmjs.com/package/@seomator/seo-audit)*