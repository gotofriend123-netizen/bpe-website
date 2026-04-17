# SEO Audit Report

**URL:** [http://localhost:8081](http://localhost:8081)
**Date:** 4/17/2026, 1:57:58 PM

## Overall Score

| Score | Rating |
|-------|--------|
| **93/100** :white_check_mark: | Excellent |

> :white_check_mark: **Audit passed** (score >= 70)

## Category Breakdown

| Category | Score | Passed | Warnings | Failed |
|----------|-------|--------|----------|--------|
| Core | 94 :white_check_mark: | 8 | 2 | 9 |
| Technical SEO | 87 :yellow_circle: | 6 | 4 | 3 |
| Performance | 95 :white_check_mark: | 17 | 4 | 1 |
| Links | 97 :white_check_mark: | 17 | 2 | 0 |
| Images | 100 :white_check_mark: | 14 | 0 | 0 |
| Security | 86 :yellow_circle: | 7 | 5 | 4 |
| Crawlability | 97 :white_check_mark: | 16 | 2 | 0 |
| Structured Data | 90 :white_check_mark: | 8 | 4 | 1 |
| Accessibility | 95 :white_check_mark: | 10 | 2 | 0 |
| Content | 98 :white_check_mark: | 13 | 1 | 3 |
| Social | 48 :red_circle: | 0 | 3 | 6 |
| E\-E\-A\-T | 86 :yellow_circle: | 8 | 6 | 0 |
| URL Structure | 100 :white_check_mark: | 14 | 0 | 0 |
| Mobile | 100 :white_check_mark: | 5 | 0 | 0 |
| Internationalization | 100 :white_check_mark: | 9 | 0 | 1 |
| Legal Compliance | 100 :white_check_mark: | 1 | 0 | 0 |
| JavaScript Rendering | 100 :white_check_mark: | 9 | 0 | 4 |
| Redirects | 100 :white_check_mark: | 8 | 0 | 0 |
| HTML Validation | 100 :white_check_mark: | 7 | 0 | 2 |
| AI/GEO Readiness | 89 :yellow_circle: | 2 | 1 | 2 |

## :x: Failures

Found 36 failing checks:

### core\-title\-present

- **Category:** Core
- **Status:** :x: Failed
- **Message:** No <title> tag found in the document
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### core\-title\-length

- **Category:** Core
- **Status:** :x: Failed
- **Message:** No <title> tag found in the document
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### core\-description\-present

- **Category:** Core
- **Status:** :x: Failed
- **Message:** No <meta name="description"> tag found in the document
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### core\-canonical\-present

- **Category:** Core
- **Status:** :x: Failed
- **Message:** No <link rel="canonical"> tag found in the document
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### core\-viewport\-present

- **Category:** Core
- **Status:** :x: Failed
- **Message:** No <meta name="viewport"> tag found in the document
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### core\-favicon\-present

- **Category:** Core
- **Status:** :x: Failed
- **Message:** No favicon link tag found in the document
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### core\-h1\-present

- **Category:** Core
- **Status:** :x: Failed
- **Message:** No <h1> tag found in the document
- **Details:**
  - found: `false`
  - count: `0`
  - pageUrl: `http://localhost:8081`

### core\-h1\-single

- **Category:** Core
- **Status:** :x: Failed
- **Message:** No <h1> tag found in the document
- **Details:**
  - count: `0`
  - pageUrl: `http://localhost:8081`

### core\-title\-unique

- **Category:** Core
- **Status:** :x: Failed
- **Message:** Page has no title tag
- **Details:**
  - title: `null`
  - url: `http://localhost:8081`
  - pageUrl: `http://localhost:8081`

### technical\-robots\-txt\-exists

- **Category:** Technical SEO
- **Status:** :x: Failed
- **Message:** robots\.txt returned HTTP 500 \(expected 200\)
- **Details:**
  - url: `http://localhost:8081/robots\.txt`
  - statusCode: `500`
  - pageUrl: `http://localhost:8081`

### technical\-sitemap\-exists

- **Category:** Technical SEO
- **Status:** :x: Failed
- **Message:** No sitemap\.xml found at default location and no sitemap referenced in robots\.txt
- **Details:**
  - checkedLocations: `\["http://localhost:8081/sitemap\.xml"\]`
  - foundSitemaps: `\[\]`
  - pageUrl: `http://localhost:8081`

### technical\-server\-error

- **Category:** Technical SEO
- **Status:** :x: Failed
- **Message:** Page returned 500 Internal Server Error
- **Details:**
  - statusCode: `500`
  - label: `Internal Server Error`
  - fix: `Investigate server logs and resolve the underlying error; ensure the page returns a 200 status fo\.\.\.`
  - pageUrl: `http://localhost:8081`

### perf\-response\-time

- **Category:** Performance
- **Status:** :x: Failed
- **Message:** Response time is 1350ms \(threshold: 1000ms\) — consider server\-side optimizations, caching, or a CDN
- **Details:**
  - responseTimeMs: `1350`
  - thresholds: `\{"good":500,"warning":1000\}`
  - pageUrl: `http://localhost:8081`

### security\-https

- **Category:** Security
- **Status:** :x: Failed
- **Message:** Page is served over HTTP instead of HTTPS
- **Details:**
  - url: `http://localhost:8081`
  - protocol: `http:`
  - pageUrl: `http://localhost:8081`

### security\-x\-frame\-options

- **Category:** Security
- **Status:** :x: Failed
- **Message:** Neither X\-Frame\-Options nor CSP frame\-ancestors is set\. Site is vulnerable to clickjacking\.
- **Details:**
  - url: `http://localhost:8081`
  - xFrameOptions: `null`
  - hasFrameAncestors: `undefined`
  - pageUrl: `http://localhost:8081`

### security\-ssl\-expiry

- **Category:** Security
- **Status:** :x: Failed
- **Message:** Page is served over HTTP; no SSL certificate in use
- **Details:**
  - isHttps: `false`
  - recommendation: `Install an SSL certificate and serve the site over HTTPS`
  - pageUrl: `http://localhost:8081`

### security\-ssl\-protocol

- **Category:** Security
- **Status:** :x: Failed
- **Message:** Page is served over HTTP; TLS configuration check not applicable
- **Details:**
  - isHttps: `false`
  - recommendation: `Migrate to HTTPS to enable TLS protection`
  - pageUrl: `http://localhost:8081`

### schema\-present

- **Category:** Structured Data
- **Status:** :x: Failed
- **Message:** No structured data found on the page \(JSON\-LD, microdata, or RDFa\)
- **Details:**
  - jsonLdCount: `0`
  - microdataCount: `0`
  - rdfaCount: `0`
  - pageUrl: `http://localhost:8081`

### content\-word\-count

- **Category:** Content
- **Status:** :x: Failed
- **Message:** Extremely thin content: 0 words \(minimum 100 recommended\)
- **Details:**
  - wordCount: `0`
  - thresholds: `\{"fail":100,"warn":300,"optimal":\{"min":500,"max":2500\}\}`
  - impact: `Pages with very little content rarely rank well and may be seen as low quality`
  - recommendation: `Expand content to at least 300 words, or consider consolidating with other pages`
  - pageUrl: `http://localhost:8081`

### content\-duplicate\-description

- **Category:** Content
- **Status:** :x: Failed
- **Message:** Page has no meta description
- **Details:**
  - description: `null`
  - url: `http://localhost:8081`
  - impact: `Missing meta description reduces control over how the page appears in search results`
  - recommendation: `Add a unique, compelling meta description between 120\-160 characters`
  - pageUrl: `http://localhost:8081`

### content\-heading\-hierarchy

- **Category:** Content
- **Status:** :x: Failed
- **Message:** No headings found in the document
- **Details:**
  - headingCount: `0`
  - pageUrl: `http://localhost:8081`

### social\-og\-title

- **Category:** Social
- **Status:** :x: Failed
- **Message:** No <meta property="og:title"> tag found in the document
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### social\-og\-description

- **Category:** Social
- **Status:** :x: Failed
- **Message:** No <meta property="og:description"> tag found in the document
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### social\-og\-image

- **Category:** Social
- **Status:** :x: Failed
- **Message:** No <meta property="og:image"> tag found in the document
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### social\-og\-image\-size

- **Category:** Social
- **Status:** :x: Failed
- **Message:** No og:image found \- cannot check dimensions
- **Details:**
  - hasImage: `false`
  - pageUrl: `http://localhost:8081`

### social\-twitter\-card

- **Category:** Social
- **Status:** :x: Failed
- **Message:** No <meta name="twitter:card"> tag found in the document
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### social\-og\-url

- **Category:** Social
- **Status:** :x: Failed
- **Message:** No <meta property="og:url"> tag found in the document
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### i18n\-lang\-attribute

- **Category:** Internationalization
- **Status:** :x: Failed
- **Message:** Missing lang attribute on <html> element
- **Details:**
  - found: `true`
  - hasLang: `false`
  - recommendation: `Add lang attribute: <html lang="en">`
  - pageUrl: `http://localhost:8081`

### js\-rendered\-title

- **Category:** JavaScript Rendering
- **Status:** :x: Failed
- **Message:** Title tag is missing or empty in the rendered DOM after JavaScript execution
- **Details:**
  - renderedTitle: `null`
  - recommendation: `Ensure your JavaScript framework injects the <title> tag during rendering`
  - pageUrl: `http://localhost:8081`

### js\-rendered\-description

- **Category:** JavaScript Rendering
- **Status:** :x: Failed
- **Message:** Meta description is missing in the rendered DOM after JavaScript execution
- **Details:**
  - renderedDescription: `null`
  - recommendation: `Ensure your JavaScript framework injects <meta name="description"> during rendering`
  - pageUrl: `http://localhost:8081`

### js\-rendered\-h1

- **Category:** JavaScript Rendering
- **Status:** :x: Failed
- **Message:** H1 heading is missing or empty in the rendered DOM after JavaScript execution
- **Details:**
  - renderedH1: `null`
  - recommendation: `Ensure your JavaScript framework renders an H1 heading element`
  - pageUrl: `http://localhost:8081`

### js\-rendered\-canonical

- **Category:** JavaScript Rendering
- **Status:** :x: Failed
- **Message:** Canonical link tag is missing in the rendered DOM after JavaScript execution
- **Details:**
  - renderedCanonical: `null`
  - recommendation: `Ensure your JavaScript framework injects <link rel="canonical"> during rendering`
  - pageUrl: `http://localhost:8081`

### htmlval\-missing\-doctype

- **Category:** HTML Validation
- **Status:** :x: Failed
- **Message:** Missing DOCTYPE declaration\. Add <\!DOCTYPE html> at the beginning of the document
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### htmlval\-missing\-charset

- **Category:** HTML Validation
- **Status:** :x: Failed
- **Message:** No charset declaration found\. Add <meta charset="utf\-8"> as the first element in <head>
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### geo\-semantic\-html

- **Category:** AI/GEO Readiness
- **Status:** :x: Failed
- **Message:** Poor semantic HTML \- AI systems struggle to parse content \(only 0 semantic element\(s\) found\)
- **Details:**
  - found: `\[\]`
  - foundCount: `0`
  - elementCounts: `\{\}`
  - missingRecommended: `\["main","article","header","footer","nav"\]`
  - totalSemanticChecked: `13`
  - recommendation: `Add semantic elements like <main>, <article>, <header>, <footer>, and <nav> to help AI understand\.\.\.`
  - pageUrl: `http://localhost:8081`

### geo\-content\-structure

- **Category:** AI/GEO Readiness
- **Status:** :x: Failed
- **Message:** Poor content structure for AI extraction \(0/4 signals\)\. Missing: main content area \(<main>, <article>, or \[role="main"\]\); hierarchical headings \(h1 followed by h2, h3, etc\.\); paragraph content \(at least 30 words of prose in <p> elements\); structured data \(<ul>, <ol>, <dl>, or <table> elements\)
- **Details:**
  - presentSignals: `\[\]`
  - missingSignals: `\["main content area \(<main>, <article>, or \[role=\\"main\\"\]\)","hierarchical headings \(h1 followed \.\.\.`
  - signalCount: `0`
  - headingLevels: `\[\]`
  - paragraphWordCount: `0`
  - hasLists: `false`
  - hasTables: `false`
  - recommendation: `Add a clear <main> or <article> area, use hierarchical headings, write paragraph prose, and inclu\.\.\.`
  - pageUrl: `http://localhost:8081`

## :warning: Warnings

Found 36 warnings:

### core\-description\-length

- **Category:** Core
- **Status:** :warning: Warning
- **Message:** No <meta name="description"> tag found in the document
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### core\-canonical\-valid

- **Category:** Core
- **Status:** :warning: Warning
- **Message:** No <link rel="canonical"> tag found in the document
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### technical\-robots\-txt\-valid

- **Category:** Technical SEO
- **Status:** :warning: Warning
- **Message:** robots\.txt returned HTTP 500, cannot validate
- **Details:**
  - url: `http://localhost:8081/robots\.txt`
  - statusCode: `500`
  - pageUrl: `http://localhost:8081`

### technical\-sitemap\-valid

- **Category:** Technical SEO
- **Status:** :warning: Warning
- **Message:** Could not find sitemap to validate
- **Details:**
  - checkedUrls: `\["http://localhost:8081/sitemap\.xml","http://localhost:8081/robots\.txt"\]`
  - pageUrl: `http://localhost:8081`

### technical\-www\-redirect

- **Category:** Technical SEO
- **Status:** :warning: Warning
- **Message:** WWW version returned 500, non\-www returned 500
- **Details:**
  - url: `http://localhost:8081`
  - wwwUrl: `http://www\.localhost:8081/`
  - nonWwwUrl: `http://localhost:8081/`
  - currentIsWww: `false`
  - wwwStatus: `500`
  - nonWwwStatus: `500`
  - canonicalHostname: `null`
  - pageUrl: `http://localhost:8081`

### technical\-404\-page

- **Category:** Technical SEO
- **Status:** :warning: Warning
- **Message:** Non\-existent page returned 500 instead of 404
- **Details:**
  - testUrl: `http://localhost:8081/seo\-audit\-test\-nonexistent\-page\-9esum3g2zlw\-1776414474443`
  - statusCode: `500`
  - pageUrl: `http://localhost:8081`

### cwv\-inp

- **Category:** Performance
- **Status:** :warning: Warning
- **Message:** Could not measure Interaction to Next Paint \(no user interaction detected or metric not available\)
- **Details:**
  - metric: `INP`
  - reason: `No interaction or metric not available`
  - pageUrl: `http://localhost:8081`

### cwv\-ttfb

- **Category:** Performance
- **Status:** :warning: Warning
- **Message:** TTFB is 908ms \(needs improvement, should be under 800ms\)
- **Details:**
  - metric: `TTFB`
  - value: `908`
  - valueFormatted: `908ms`
  - threshold: `\{"good":800,"poor":1800\}`
  - pageUrl: `http://localhost:8081`

### perf\-brotli

- **Category:** Performance
- **Status:** :warning: Warning
- **Message:** Using gzip but not Brotli — Brotli gives ~15\-20% better compression for text assets
- **Details:**
  - contentEncoding: `gzip`
  - currentEncoding: `gzip`
  - recommendation: `br`
  - pageUrl: `http://localhost:8081`

### perf\-http2

- **Category:** Performance
- **Status:** :warning: Warning
- **Message:** No alt\-svc header found — server may not support HTTP/2 or HTTP/3 \(informational\)
- **Details:**
  - altSvc: `not set`
  - pageUrl: `http://localhost:8081`

### links\-internal\-present

- **Category:** Links
- **Status:** :warning: Warning
- **Message:** No internal links found on this page
- **Details:**
  - internalLinkCount: `0`
  - selfLinks: `0`
  - suggestion: `Add internal links to improve site navigation and help search engines crawl your site`
  - pageUrl: `http://localhost:8081`

### links\-dead\-end\-pages

- **Category:** Links
- **Status:** :warning: Warning
- **Message:** Page is a dead\-end with no outgoing internal links
- **Details:**
  - internalLinkCount: `0`
  - recommendation: `Add navigation links, related content links, or breadcrumbs`
  - pageUrl: `http://localhost:8081`

### security\-https\-redirect

- **Category:** Security
- **Status:** :warning: Warning
- **Message:** HTTP version returns status 500 \(expected 301/302 redirect to HTTPS\)
- **Details:**
  - httpUrl: `http://localhost:8081/`
  - expectedHttpsUrl: `https://localhost:8081/`
  - statusCode: `500`
  - redirectLocation: `null`
  - pageUrl: `http://localhost:8081`

### security\-hsts

- **Category:** Security
- **Status:** :warning: Warning
- **Message:** HSTS only applies to HTTPS URLs; site is currently served over HTTP
- **Details:**
  - url: `http://localhost:8081`
  - protocol: `http:`
  - pageUrl: `http://localhost:8081`

### security\-csp

- **Category:** Security
- **Status:** :warning: Warning
- **Message:** Content\-Security\-Policy header is missing\. Consider adding CSP to prevent XSS attacks\.
- **Details:**
  - url: `http://localhost:8081`
  - pageUrl: `http://localhost:8081`

### security\-permissions\-policy

- **Category:** Security
- **Status:** :warning: Warning
- **Message:** Permissions\-Policy header is missing\. Consider adding to control browser features\.
- **Details:**
  - url: `http://localhost:8081`
  - pageUrl: `http://localhost:8081`

### security\-referrer\-policy

- **Category:** Security
- **Status:** :warning: Warning
- **Message:** Referrer\-Policy is not set\. Consider adding to control referrer information\.
- **Details:**
  - url: `http://localhost:8081`
  - pageUrl: `http://localhost:8081`

### crawl\-sitemap\-domain

- **Category:** Crawlability
- **Status:** :warning: Warning
- **Message:** Could not find sitemap to validate
- **Details:**
  - checkedUrls: `\["http://localhost:8081/sitemap\.xml","http://localhost:8081/robots\.txt"\]`
  - pageUrl: `http://localhost:8081`

### crawl\-canonical\-redirect

- **Category:** Crawlability
- **Status:** :warning: Warning
- **Message:** No canonical tag found
- **Details:**
  - hasCanonical: `false`
  - pageUrl: `http://localhost:8081`

### schema\-valid

- **Category:** Structured Data
- **Status:** :warning: Warning
- **Message:** No JSON\-LD scripts found to validate
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### schema\-type

- **Category:** Structured Data
- **Status:** :warning: Warning
- **Message:** No JSON\-LD scripts found to check for @type
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### schema\-required\-fields

- **Category:** Structured Data
- **Status:** :warning: Warning
- **Message:** No JSON\-LD scripts found to check for required fields
- **Details:**
  - found: `false`
  - pageUrl: `http://localhost:8081`

### schema\-website\-search

- **Category:** Structured Data
- **Status:** :warning: Warning
- **Message:** Homepage missing WebSite schema
- **Details:**
  - isHomepage: `true`
  - suggestion: `Add WebSite schema to enable sitelinks searchbox`
  - pageUrl: `http://localhost:8081`

### a11y\-heading\-order

- **Category:** Accessibility
- **Status:** :warning: Warning
- **Message:** No headings found on page
- **Details:**
  - recommendation: `Add heading structure for accessibility and SEO`
  - pageUrl: `http://localhost:8081`

### a11y\-landmark\-regions

- **Category:** Accessibility
- **Status:** :warning: Warning
- **Message:** Missing essential landmark: <main>\. Also missing: main, navigation, banner/header, contentinfo/footer
- **Details:**
  - missing: `\["main","navigation","banner/header","contentinfo/footer"\]`
  - landmarks: `\{\}`
  - warnings: `\[\]`
  - recommendation: `Add <main> landmark to wrap primary content`
  - pageUrl: `http://localhost:8081`

### content\-mime\-type

- **Category:** Content
- **Status:** :warning: Warning
- **Message:** Content\-Type header missing charset specification
- **Details:**
  - header: `text/html`
  - mimeType: `text/html`
  - charset: `null`
  - recommendation: `Add charset=utf\-8 to Content\-Type header: "text/html; charset=utf\-8"`
  - impact: `Missing charset can cause character encoding issues for international content`
  - pageUrl: `http://localhost:8081`

### social\-og\-url\-canonical

- **Category:** Social
- **Status:** :warning: Warning
- **Message:** Neither og:url nor canonical URL found \- add both for consistent SEO signals
- **Details:**
  - hasOgUrl: `false`
  - hasCanonical: `false`
  - pageUrl: `http://localhost:8081`

### social\-share\-buttons

- **Category:** Social
- **Status:** :warning: Warning
- **Message:** No social sharing buttons detected\. Add share buttons to encourage social engagement
- **Details:**
  - hasShareButtons: `false`
  - platformCount: `0`
  - suggestion: `Add share buttons for Facebook, Twitter/X, and LinkedIn`
  - pageUrl: `http://localhost:8081`

### social\-profiles

- **Category:** Social
- **Status:** :warning: Warning
- **Message:** No social media profile links found\. Add links to your social profiles in header/footer
- **Details:**
  - hasProfiles: `false`
  - profileCount: `0`
  - suggestion: `Add social profile links in header/footer and include sameAs in Organization schema`
  - pageUrl: `http://localhost:8081`

### eeat\-about\-page

- **Category:** E\-E\-A\-T
- **Status:** :warning: Warning
- **Message:** No about page link found \- important for trust and E\-E\-A\-T
- **Details:**
  - hasAboutPage: `false`
  - recommendation: `Add an "About" or "About Us" page explaining who you are and link to it from your navigation`
  - pageUrl: `http://localhost:8081`

### eeat\-author\-byline

- **Category:** E\-E\-A\-T
- **Status:** :warning: Warning
- **Message:** No author byline found
- **Details:**
  - signals: `\[\]`
  - recommendation: `Add author attribution using Schema\.org Person markup, meta author tag, or visible byline`
  - impact: `Missing author info can negatively impact E\-E\-A\-T signals, especially for YMYL content`
  - pageUrl: `http://localhost:8081`

### eeat\-author\-expertise

- **Category:** E\-E\-A\-T
- **Status:** :warning: Warning
- **Message:** No author present \- expertise check not applicable
- **Details:**
  - signals: `\[\]`
  - note: `This check requires author attribution\. See eeat\-author\-byline rule\.`
  - pageUrl: `http://localhost:8081`

### eeat\-contact\-page

- **Category:** E\-E\-A\-T
- **Status:** :warning: Warning
- **Message:** No contact page or contact methods found \- important for trust
- **Details:**
  - hasContactPage: `false`
  - contactMethods: `\[\]`
  - recommendation: `Add a contact page with multiple ways to reach you: email, phone, contact form, and physical address`
  - pageUrl: `http://localhost:8081`

### eeat\-content\-dates

- **Category:** E\-E\-A\-T
- **Status:** :warning: Warning
- **Message:** No content date signals found
- **Details:**
  - signals: `\[\]`
  - recommendation: `Add datePublished and dateModified to Article schema, or use <time> elements with datetime attrib\.\.\.`
  - impact: `Search engines use date signals to assess content freshness, which can affect rankings for time\-s\.\.\.`
  - pageUrl: `http://localhost:8081`

### eeat\-privacy\-policy

- **Category:** E\-E\-A\-T
- **Status:** :warning: Warning
- **Message:** No privacy policy link found \- important for trust and legal compliance
- **Details:**
  - hasPrivacyPolicy: `false`
  - recommendation: `Add a link to your privacy policy in the footer of every page`
  - pageUrl: `http://localhost:8081`

### geo\-llms\-txt

- **Category:** AI/GEO Readiness
- **Status:** :warning: Warning
- **Message:** No llms\.txt reference found \- consider adding for AI discoverability
- **Details:**
  - references: `\[\]`
  - referenceCount: `0`
  - note: `llms\.txt is an emerging standard \(llmstxt\.org\) \- not yet required but recommended for AI visibility`
  - recommendation: `Add <link rel="llms" href="/llms\.txt"> in <head>, or create /llms\.txt describing your site for LL\.\.\.`
  - pageUrl: `http://localhost:8081`

## Summary

| Metric | Count |
|--------|-------|
| Total Checks | 251 |
| :white_check_mark: Passed | 179 |
| :warning: Warnings | 36 |
| :x: Failures | 36 |

---

*Generated by [SEOmator CLI](https://www.npmjs.com/package/@seomator/seo-audit)*