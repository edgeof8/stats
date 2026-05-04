**✅ PRD: stats**  
**Page Statistics Overlay Bookmarklet**

**Version**: 0.1  
**Date**: May 4, 2026  
**Author**: edgeof8  
**Status**: Draft – Ready for implementation

---

### 1. Executive Summary

**stats** is a beautiful, one-click bookmarklet that displays a clean, modern overlay with detailed statistics about any webpage — word count, reading time, image count, heading structure, link density, and more.

It’s the perfect daily companion in the **Edge Toolkit**:

- `md-memo` → save the article  
- `cite` → cite it properly  
- **stats** → understand the page at a glance before you save or cite

**One click. Instant insight. Beautiful design. Works on every site.**

---

### 2. Problem Statement

Writers, editors, researchers, and content creators constantly need quick insights about a page, but:

- Manually counting words or scanning headings is tedious
- Most tools are either browser extensions or full websites
- There’s no lightweight, beautiful, instant way to see page health and structure

**stats** solves this with the same philosophy as the rest of the suite: **fast, beautiful, and privacy-first**.

---

### 3. Goals

**Primary Goal**  
Show a gorgeous, informative statistics overlay on any webpage with one click.

**Secondary Goals**
- Provide immediately useful metrics for writers and researchers
- Feel premium and delightful (not just a boring list)
- Match the speed and polish of `bttn`, `md-memo`, `x-memo`, `yt-memo`, and `cite`

**Success Metrics (MVP)**
- Works on 98%+ of webpages
- Overlay feels fast and beautiful
- < 2.5 KB minified bookmarklet size
- Zero external dependencies

---

### 4. Target Users

- Writers and editors (word count, reading time, structure)
- Researchers and students (heading outline, link density)
- SEO specialists and content strategists
- Anyone who uses `md-memo` and wants to analyze before clipping
- Power users who love quick insights

---

### 5. Key Features (MVP)

| Feature                    | Description                                                                 | Priority |
|---------------------------|-----------------------------------------------------------------------------|----------|
| **Word Count**            | Accurate total word count + character count                                 | P0      |
| **Reading Time**          | Estimated reading time (adjustable WPM: 200 / 250 / 300)                    | P0      |
| **Image Count**           | Total images + images with alt text percentage                              | P0      |
| **Heading Structure**     | Count of H1–H6 + clean clickable outline                                    | P0      |
| **Link Stats**            | Total links, external links, internal links, link density %                 | P0      |
| **Additional Metrics**    | Paragraphs, lists, code blocks, tables                                      | P1      |
| **Beautiful Overlay**     | Modern, minimal, dark/light aware design with smooth animations             | P0      |
| **Toggle & Dismiss**      | Easy to open/close, keyboard accessible (Esc)                               | P0      |
| **Toast + Title Feedback**| Brief confirmation + tab title flash                                        | P0      |

**Nice-to-have (Post-MVP)**
- Export stats as Markdown or JSON
- Readability score (Flesch-Kincaid)
- Color contrast / accessibility quick check
- Draggable overlay position

---

### 6. User Flow

1. User is on any webpage
2. Clicks **stats** bookmark
3. Beautiful overlay appears instantly with all key metrics
4. User can:
   - Click any heading in the outline to scroll to it
   - Toggle between different reading speeds
   - Copy stats as Markdown (optional button)
5. Press `Esc` or click outside to dismiss

**Edge case handling**:
- Very long pages → still fast
- Pages with heavy JavaScript → calculates on current DOM state
- PDF viewer → shows available stats + note

---

### 7. Technical Requirements

- **Pure client-side JavaScript**
- **Lightweight DOM traversal** for all counts (no heavy libraries)
- **Inline CSS** for the overlay (modern, clean design)
- **Smart calculations**:
  - Word count via text content extraction
  - Reading time with configurable WPM
  - Heading outline with proper hierarchy
- **Clipboard support** for “Copy stats as Markdown”
- **Minified size** target: < 2.5 KB

**Key Technical Challenges & Solutions**
- Accurate word counting on complex pages → clean text extraction + whitespace normalization
- Heading outline → recursive DOM walk with level tracking
- Performance on huge pages → use `document.body.innerText` + efficient queries

---

### 8. Non-Functional Requirements

- **Privacy**: 100% local — no data leaves the browser
- **Performance**: Overlay appears in < 300ms
- **Design**: Clean, modern, minimal (inspired by Notion / Linear aesthetics)
- **Accessibility**: Keyboard navigation + ARIA labels
- **Maintainability**: Clean, well-commented code

---

### 9. Scope

**In Scope (MVP)**
- All standard webpages
- Core metrics: words, reading time, images, headings, links
- Beautiful overlay with smooth UX
- Clickable heading outline

**Out of Scope (MVP)**
- Advanced SEO metrics (keyword density, etc.)
- Image analysis (file sizes, dimensions)
- Real-time updates while page changes
- Mobile-specific optimizations (future)

---

### 10. Success Criteria

**Launch Criteria**
- Successfully displays useful stats on 20 diverse real-world pages
- Overlay looks premium and feels delightful
- Heading outline works perfectly and is clickable
- Matches the quality bar of the rest of the Edge Toolkit

**Post-Launch**
- Users report it becomes part of their daily workflow

---

### 11. Risks & Mitigations

| Risk                        | Likelihood | Impact | Mitigation |
|-----------------------------|------------|--------|----------|
| Extremely long or complex pages | Medium   | Low    | Efficient traversal + lazy calculation |
| Overlay styling conflicts   | Low        | Medium | Use high z-index + scoped CSS variables |
| Inaccurate word counts      | Low        | Low    | Test against known pages + refine regex |

---

### 12. Future Roadmap (Post-MVP)

- **v0.2**: Export stats as Markdown note (pairs perfectly with `md-memo`)
- **v0.3**: Readability score + suggestions
- **v0.4**: “Compare mode” (stats from two tabs side-by-side)
- **v0.5**: Dark mode toggle + custom themes
