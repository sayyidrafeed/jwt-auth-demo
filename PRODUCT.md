# Product

## Register

brand

## Users

University students in a web security or authentication course, and their lecturer. Primary context is classroom demonstration and independent exploration. Students come from varying levels of familiarity with cryptography and backend architecture—some need the visual JWT decoder to connect abstract concepts to concrete token structures. The lecturer uses the demo to illustrate JWT mechanics, refresh token rotation, and token revocation live.

## Product Purpose

An interactive, developer-focused authentication demo that visualises the full lifecycle of JWT-based auth—token issuance, cookie-based transport, refresh rotation, blacklist revocation, and protected asset serving. Built to teach the mechanics of stateless authentication with stateful revocation in a production-style stack (Next.js 16, Drizzle ORM, PostgreSQL). The interactive JWT decoder, session manifest, and unauthorized-access probe let students experiment with real cryptographic token flows rather than reading about them.

## Brand Personality

Technical, precise, and warm. Speaks the language of protocols, headers, and cryptographic primitives without being cold or inaccessible. The tone is "operator at a terminal who actually enjoys their work." Confidence without arrogance. The warm beige palette and stone tones soften what could otherwise feel like a purely machine-facing interface.

Voice characteristics:
- Short, declarative, uppercase labels (SESSION_INFO_MANIFEST, CREDENTIALS_PROBE)
- Terminal/console metaphors (PROBE_RESPONSE, ACTIVE_NODE, JWT_DECODER_PROBE)
- Developer affinity without alienating learners
- Earnest about the craft of authentication, not ironic or over-designed

## Anti-references

- Generic SaaS landing pages with hero-metric templates (big number + small label + gradient)
- Corporate enterprise dashboards (navy, gold, heavy sidebars)
- Dark-tool cliché (neon on black, glassmorphism, "hacker green" terminals)
- Over-designed "design system" demos that obscure the underlying technical content
- Idential card grids with icon + heading + text

## Design Principles

1. **Show the mechanics, not just the interface.** Every UI element should reveal something about how JWT auth works. The JWT decoder lets students inspect header/payload/signature. The 401 probe demonstrates what happens without credentials. The session manifest shows raw claims. If an element doesn't teach, it doesn't belong.

2. **Warmth without fluff.** The warm beige/stone palette makes a technical subject approachable, but every word and pixel earns its place. No decorative gradients, no glass cards, no hero-metric templates. Visual texture comes from the grid background, console-style headers, and careful typographic hierarchy.

3. **Developer affinity, learner accessibility.** Monospace type and protocol-adjacent labels create a "this is the real thing" feel. But the underlying content explains what's happening—the labels are flavour, not obfuscation. Students should feel like they're using a real security tool, not a toy demo.

4. **Consistency across surfaces.** The landing page, dashboard, auth forms, and token inspector share the same design language. No orphan pages. The token inspector currently lags behind the landing/dashboard polish—that's a gap to close.

## Accessibility & Inclusion

- WCAG AA contrast throughout (the warm palette uses sufficient contrast ratios)
- Focus-visible rings on all interactive elements
- Form labels associated with inputs
- Error states use both colour and iconography (not colour alone)
- Reduced motion respected (animations are optional pulse/ping for status indicators, not essential)
