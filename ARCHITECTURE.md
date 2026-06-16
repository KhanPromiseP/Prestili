# Prestili Architecture Document

## Executive Summary

Prestili is a next-generation AI-native presentation creation, editing, and storytelling platform that transforms ideas into extraordinary presentations through AI, spatial storytelling, cinematic presentation rendering, and professional design automation.

**Core Philosophy**: Display quality over text. Visual storytelling. Presentation rendering quality. Motion quality. Layout intelligence. Color harmony. Narrative flow.

---

## Research Phase: Platform Analysis

### Presentation Platforms Comparison

| Platform | Strengths | Weaknesses | Opportunities for Prestili |
|----------|-----------|------------|---------------------------|
| **Prezi** | - Zooming User Interface (ZUI)<br>- Spatial relationships<br>- Non-linear navigation<br>- Cinematic transitions<br>- Mind map metaphor | - Steep learning curve<br>- Limited traditional editing<br>- Performance issues with large presentations<br>- Limited AI integration | - Combine ZUI with traditional editing<br>- AI-powered spatial arrangement<br>- Better performance with canvas optimization<br>- Enhanced design intelligence |
| **Canva** | - Beautiful templates<br>- Drag-and-drop simplicity<br>- Asset library integration<br>- Brand consistency tools<br>- Collaboration features | - Limited presentation-specific features<br>- Generic design approach<br>- Limited animation control<br}- Template dependency | - Presentation-first design system<br>- AI-driven layout intelligence<br>- Context-aware asset selection<br>- Premium design automation |
| **PowerPoint** | - Familiar interface<br>- Powerful editing tools<br>- Extensive template library<br>- Offline capability<br>- Enterprise integration | - Dated design paradigm<br>- Limited AI features<br>- Linear slide model<br>- Poor mobile experience | - Modern interface with traditional power<br>- AI-native from ground up<br>- Spatial presentation modes<br>- Cross-platform excellence |
| **Google Slides** | - Real-time collaboration<br>- Cloud-native<br>- Simple sharing<br>- Integration with Google Workspace<br>- Free tier | - Limited design features<br>- Basic animations<br>- Offline limitations<br}- Generic templates | - Enhanced collaboration with spatial features<br>- AI-assisted design<br>- Rich animation system<br>- Professional design quality |
| **Gamma** | - AI-first approach<br>- Quick generation<br>- Modern design<br>- Card-based layout<br>- Content transformation | - Limited editing control<br}- Template constraints<br>- Limited spatial features<br>- Basic customization | - AI + full editing control<br>- Spatial presentation modes<br>- Unlimited customization<br>- Professional design system |

### Canvas & Rendering Tools Comparison

| Tool | Strengths | Weaknesses | Prestili Integration Strategy |
|------|-----------|------------|------------------------------|
| **tldraw** | - Infinite canvas engine<br>- Multiplayer collaboration<br>- Extensible shapes/tools<br>- Runtime API<br>- AI integration primitives | - Learning curve for customization<br>- Performance with complex scenes<br>- Limited presentation-specific features | - Use as foundation for Global Presentation Map<br>- Custom shapes for presentation elements<br>- Multiplayer for future collaboration<br>- Extend with presentation-specific tools |
| **Konva.js** | - High performance canvas<br>- Rich shape library<br>- Animation system<br>- Event handling<br>- Layer management<br>- Filter effects | - Canvas-only (no DOM)<br>- Limited built-in UI<br>- Manual state management | - Core rendering engine for slides<br>- Animation system for transitions<br>- Layer management for complex slides<br>- Performance optimization for large presentations |

### Technology Stack Analysis

| Technology | Strengths | Weaknesses | Prestili Usage |
|------------|-----------|------------|----------------|
| **Next.js App Router** | - Server components<br>- Optimized performance<br>- Built-in routing<br>- API routes<br>- Excellent TypeScript support | - Complexity for simple apps<br>- Build time overhead | - Main application framework<br>- API routes for backend<br>- Server components for performance |
| **Prisma** | - Type-safe queries<br>- Excellent TypeScript support<br>- Migration system<br>- Relation management<br>- Performance optimizations | - Learning curve<br>- Schema file management | - Database ORM<br>- Type-safe data access<br>- Migration management |
| **PostgreSQL + JSONB** | - Relational + document hybrid<br>- Powerful JSONB indexing<br>- ACID compliance<br>- Mature ecosystem<br>- Performance with proper indexing | - JSONB update performance<br>- Storage overhead | - Store presentation documents as JSONB<br>- Relational data for users/metadata<br>- Hybrid approach for flexibility |
| **MinIO** | - S3-compatible API<br>- Self-hosted<br>- High performance<br>- AI/ML optimized<br>- Open source | - Setup complexity<br>- Limited managed features | - Asset storage (images, videos)<br>- Presentation exports<br>- CDN integration ready |

---

## Product Vision

### Core Differentiation

Prestili is NOT:
- A slide generator
- A document editor
- A clone of existing tools

Prestili IS:
- A visual intelligence system
- AI-native from the ground up
- Spatial storytelling platform
- Cinematic presentation renderer
- Professional design automation engine

### User Value Proposition

**For Creators**: Transform ideas into visually stunning presentations in minutes, not hours. AI handles design while you control narrative.

**For Presenters**: Deliver memorable presentations with spatial storytelling, cinematic transitions, and professional polish.

**For Teams**: Collaborate on presentations with real-time editing, version history, and consistent branding.

---

## User Journeys

### Journey 1: AI-Powered Creation

1. **Input**: User provides title, prompt, outline, notes, or uploads content
2. **AI Analysis**: System analyzes content, determines optimal structure
3. **Structure Generation**: AI creates slide hierarchy, sections, narrative flow
4. **Design Application**: AI applies typography, colors, layouts based on context
5. **Asset Selection**: AI selects relevant images, icons, charts
6. **Global Map Generation**: AI arranges slides in spatial structure (tree/flow/cluster/spiral/constellation)
7. **Review**: User reviews and refines in traditional editor
8. **Present**: User presents in classic, zoom, or story mode

### Journey 2: Manual Editing with AI Assistance

1. **Canvas Selection**: User chooses editing mode (traditional or spatial)
2. **Element Creation**: User adds text, shapes, images with drag-and-drop
3. **AI Suggestions**: System suggests layouts, colors, typography
4. **Intelligent Snapping**: Elements snap to grids, align automatically
5. **Layer Management**: User organizes elements with layer panel
6. **Animation Design**: User creates animations with timeline
7. **Real-time Preview**: User sees changes instantly
8. **Export**: User exports to multiple formats

### Journey 3: Spatial Presentation

1. **Global Map View**: User sees entire presentation as spatial world
2. **Structure Selection**: User chooses arrangement (tree/flow/cluster/spiral/constellation)
3. **Path Planning**: User defines narrative path through slides
4. **Camera Animation**: System generates smooth camera movements
5. **Presentation Mode**: User presents with zoom-based navigation
6. **Story Mode**: Content reveals line-by-line with typing animation
7. **Audience Engagement**: Interactive elements, embedded content
8. **Analytics**: System tracks engagement metrics

---

## Functional Requirements

### Module 1: Presentation Document Engine

**Requirements**:
- Internal JSON presentation format with hierarchical structure
- Support for Project → Presentation → Sections → Slides → Elements → Animation → Spatial coordinates → Visual metadata
- Version history with diff capability
- Undo/redo system with operation stack
- Future collaboration architecture (CRDT-ready)
- Document validation and schema enforcement
- Import/export capabilities (PPTX, PDF, JSON)

**Data Structure**:
```typescript
interface PresentationDocument {
  id: string;
  projectId: string;
  metadata: {
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    version: number;
  };
  structure: {
    sections: Section[];
    globalMap: GlobalMapConfig;
  };
  designSystem: DesignSystem;
  versionHistory: Version[];
}

interface Section {
  id: string;
  title: string;
  slides: Slide[];
  spatialPosition: SpatialCoordinates;
}

interface Slide {
  id: string;
  elements: Element[];
  animation: AnimationConfig;
  layout: LayoutConfig;
  speakerNotes: string;
}

interface Element {
  id: string;
  type: 'text' | 'image' | 'shape' | 'video' | 'chart' | 'icon';
  content: any;
  position: Position;
  size: Size;
  style: Style;
  animation?: ElementAnimation;
}
```

### Module 2: PowerPoint Editing Mode

**Requirements**:
- Traditional slide-based editing interface
- Drag-and-drop element manipulation
- Resize handles with aspect ratio lock
- Layer management panel
- Rich text editing with formatting
- Grouping/ungrouping elements
- Alignment guides and snapping
- Smart layout suggestions
- AI-powered editing assistance
- Real-time preview
- Keyboard shortcuts

**Key Features**:
- Canvas-based editor using Konva.js
- Element selection with bounding box
- Multi-select with shift-click
- Context-aware property panel
- Template library
- Master slide support
- Slide sorter view
- Notes panel

### Module 3: Global Presentation Map

**Requirements**:
- Spatial visualization of entire presentation
- AI-driven arrangement algorithms
- Multiple structure modes:
  - Tree Mode: Hierarchical branching
  - Flow Mode: Narrative path
  - Cluster Mode: Grouped sections
  - Spiral Mode: Zoom journey
  - Constellation Mode: Connected ideas
- Camera animation between slides
- Interactive navigation
- Mini-map for orientation
- Path visualization
- Custom arrangement tools

**Technical Implementation**:
- tldraw-based infinite canvas
- Custom shapes for slides
- Spatial graph algorithms
- Camera interpolation system
- Zoom level management
- Performance optimization (virtualization)

### Module 4: Presentation Play Engine

**Requirements**:
- Multiple presentation modes:
  - Classic Slide Mode: Traditional slide-by-slide
  - Zoom Mode: Prezi-style spatial navigation
  - Story Mode: Progressive content reveal
- Smooth transitions between modes
- Keyboard navigation
- Presenter view with notes
- Timer and progress indicator
- Full-screen mode
- Export to video
- Embedded web content support

**Animation System**:
- Timeline-based animation editor
- Preset animation library
- Custom easing functions
- Synchronized animations
- Trigger-based animations

### Module 5: AI Creation Engine

**Requirements**:
- Multiple input types:
  - Title only
  - Natural language prompt
  - Structured outline
  - Notes/rough content
  - Long text documents
  - Uploaded files (PDF, DOCX)
- Optional user parameters:
  - Number of slides
  - Target audience
  - Presentation length
  - Tone/style
  - Industry context
- AI decision outputs:
  - Optimal slide count
  - Section structure
  - Content hierarchy
  - Layout selection
  - Content summarization
- Structured JSON output (never raw HTML)

**AI Pipeline**:
1. Content analysis and understanding
2. Structure extraction and organization
3. Narrative flow determination
4. Slide count optimization
5. Content generation and summarization
6. Layout selection per slide
7. Design system application
8. Asset selection and placement
9. Global map arrangement
10. Quality validation

### Module 6: Design Intelligence

**Requirements**:
- AI as creative director
- Typography intelligence:
  - Scale determination
  - Weight selection
  - Spacing optimization
  - Font pairing
- Color harmony:
  - Elegant, blended palettes
  - Premium, professional tones
  - Soft, sophisticated combinations
  - Never loud or random
- Layout intelligence:
  - Image left/text right
  - Image right/text left
  - Split visual
  - Hero layouts
  - Storytelling layouts
  - Data visualization layouts
- Image blending:
  - Dominant image placement
  - Color extraction
  - Gradient overlays
  - Text readability optimization
- Content formatting:
  - Bullet vs paragraph decision
  - Icon usage
  - Diagram generation
  - Emphasis techniques (bold, size, color)

**Design System**:
```typescript
interface DesignSystem {
  typography: {
    headingFont: string;
    bodyFont: string;
    scale: number[];
    weights: number[];
    spacing: number[];
  };
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
    neutral: string[];
  };
  layouts: LayoutTemplate[];
  spacing: {
    base: number;
    scale: number[];
  };
}
```

### Module 7: Asset Engine

**Requirements**:
- Image integration:
  - Unsplash API
  - Pexels API
  - Custom uploads
  - AI-generated images
- Icon library:
  - Lucide icons
  - Custom icon packs
  - SVG support
- Chart generation:
  - Data visualization
  - Chart.js integration
  - Custom chart types
- Video support:
  - Embed YouTube/Vimeo
  - Custom uploads
  - Video optimization
- Context-aware selection:
  - Relevance scoring
  - Style matching
  - License compliance

**Asset Management**:
- CDN integration
- Image optimization
- Thumbnail generation
- Asset tagging
- Search functionality
- Favorites system

### Module 8: Admin Dashboard

**Requirements**:
- User management:
  - User list with search/filter
  - Role management
  - Activity monitoring
  - Subscription management
- Provider management:
  - AI provider configuration
  - API key management
  - Usage monitoring
  - Cost tracking
- System prompts:
  - Prompt template management
  - A/B testing
  - Performance metrics
- Usage analytics:
  - Presentation statistics
  - Feature usage
  - Storage metrics
- Storage management:
  - Asset cleanup
  - Storage optimization
  - Backup management
- Feature flags:
  - Feature toggles
  - Rollout management
  - A/B testing

**Security**:
- Authentication required
- Role-based access control
- Audit logging
- IP whitelisting option

### Module 9: Settings System

**Requirements**:
- Environment-based configuration
- Secret management
- Provider switching
- Environment validation
- No hardcoded values

**Configuration Structure**:
```typescript
interface AppConfig {
  database: {
    url: string;
    poolSize: number;
  };
  storage: {
    endpoint: string;
    accessKey: string;
    secretKey: string;
    bucket: string;
  };
  ai: {
    providers: AIProvider[];
    defaultProvider: string;
  };
  auth: {
    provider: 'nextauth' | 'clerk' | 'custom';
    secret: string;
  };
  features: {
    collaboration: boolean;
    export: boolean;
    aiGeneration: boolean;
  };
}
```

---

## Non-Functional Requirements

### Performance

- **Canvas Rendering**: 60fps for smooth animations
- **Load Time**: < 2 seconds for initial load
- **AI Generation**: < 30 seconds for full presentation
- **Storage**: < 100ms for document retrieval
- **API Response**: < 200ms p95 latency
- **Memory**: < 500MB for typical presentation

### Scalability

- **Users**: Support 10,000+ concurrent users
- **Presentations**: Support 1M+ presentations
- **Storage**: Petabyte-scale asset storage
- **AI Requests**: 1000+ concurrent AI requests

### Security

- **Authentication**: OAuth 2.0 / OpenID Connect
- **Authorization**: Role-based access control (RBAC)
- **Encryption**: TLS 1.3 for transport, AES-256 for data at rest
- **Data Privacy**: GDPR compliant
- **API Security**: Rate limiting, input validation, SQL injection prevention

### Reliability

- **Uptime**: 99.9% SLA
- **Backups**: Daily automated backups
- **Disaster Recovery**: RTO < 4 hours, RPO < 1 hour
- **Monitoring**: 24/7 system monitoring

### Maintainability

- **Code Quality**: TypeScript strict mode, ESLint, Prettier
- **Testing**: 80%+ code coverage
- **Documentation**: Comprehensive API docs
- **Logging**: Structured logging with correlation IDs

---

## Database Schema

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  projects      Project[]
  subscriptions Subscription[]
  sessions      Session[]
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  presentations Presentation[]
  
  @@index([userId])
}

model Presentation {
  id          String   @id @default(cuid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
  title       String
  description String?
  
  // Core document stored as JSONB
  document    Json
  
  // Metadata for querying
  slideCount  Int      @default(0)
  version     Int      @default(1)
  
  // Design system
  designSystem Json?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  versions    PresentationVersion[]
  shares      Share[]
  
  @@index([projectId])
  @@index([userId])
}

model PresentationVersion {
  id             String   @id @default(cuid())
  presentationId String
  presentation   Presentation @relation(fields: [presentationId], references: [id])
  
  document       Json
  version        Int
  changeLog      String?
  createdAt      DateTime @default(now())
  
  @@index([presentationId])
}

model Share {
  id             String   @id @default(cuid())
  presentationId String
  presentation   Presentation @relation(fields: [presentationId], references: [id])
  
  token          String   @unique
  permissions    Json     // { canView: boolean, canEdit: boolean }
  expiresAt      DateTime?
  createdAt      DateTime @default(now())
  
  @@index([presentationId])
}

model Subscription {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  plan      String   // 'free', 'pro', 'enterprise'
  status    String   // 'active', 'cancelled', 'expired'
  
  stripeCustomerId String?
  stripeSubscriptionId String?
  
  currentPeriodStart DateTime?
  currentPeriodEnd   DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  
  sessionToken String   @unique
  expires      DateTime
  
  createdAt    DateTime @default(now())
  
  @@index([userId])
}

model Asset {
  id          String   @id @default(cuid())
  type        String   // 'image', 'video', 'icon', 'chart'
  
  // Storage metadata
  storageKey  String   @unique
  storageUrl  String
  size        Int
  mimeType    String
  
  // Asset metadata
  metadata    Json?    // { width, height, duration, etc. }
  tags        String[] // For search
  
  // Source tracking
  source      String?  // 'unsplash', 'pexels', 'upload', 'ai-generated'
  sourceId    String?
  
  createdAt   DateTime @default(now())
  
  @@index([type])
  @@index([tags])
}
```

### JSONB Document Structure

The main presentation document is stored as JSONB for flexibility:

```json
{
  "metadata": {
    "title": "Presentation Title",
    "description": "Description",
    "theme": "modern",
    "aspectRatio": "16:9"
  },
  "globalMap": {
    "mode": "tree",
    "cameraPath": [
      {"x": 0, "y": 0, "zoom": 1, "slideId": "slide-1"},
      {"x": 500, "y": 200, "zoom": 1.5, "slideId": "slide-2"}
    ]
  },
  "sections": [
    {
      "id": "section-1",
      "title": "Introduction",
      "slides": ["slide-1", "slide-2"]
    }
  ],
  "slides": {
    "slide-1": {
      "id": "slide-1",
      "layout": "title-slide",
      "elements": [
        {
          "id": "element-1",
          "type": "text",
          "content": "Welcome",
          "position": {"x": 100, "y": 100},
          "size": {"width": 400, "height": 100},
          "style": {
            "fontSize": 48,
            "fontWeight": "bold",
            "color": "#000000"
          }
        }
      ],
      "animation": {
        "entrance": "fade-in",
        "duration": 500
      },
      "speakerNotes": "Welcome everyone to this presentation"
    }
  }
}
```

---

## Folder Structure

```
prestili/
├── apps/
│   ├── web/                          # Next.js web application
│   │   ├── app/
│   │   │   ├── (auth)/               # Auth routes
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   ├── (dashboard)/          # Dashboard routes
│   │   │   │   ├── dashboard/
│   │   │   │   ├── presentations/
│   │   │   │   └── settings/
│   │   │   ├── (editor)/             # Editor routes
│   │   │   │   ├── editor/[id]/
│   │   │   │   └── present/[id]/
│   │   │   ├── (admin)/              # Admin routes
│   │   │   │   └── admin/
│   │   │   ├── api/                  # API routes
│   │   │   │   ├── presentations/
│   │   │   │   ├── ai/
│   │   │   │   ├── assets/
│   │   │   │   └── auth/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── editor/               # Editor components
│   │   │   │   ├── canvas/
│   │   │   │   ├── toolbar/
│   │   │   │   ├── panels/
│   │   │   │   └── elements/
│   │   │   ├── presentation/         # Presentation components
│   │   │   │   ├── player/
│   │   │   │   ├── global-map/
│   │   │   │   └── modes/
│   │   │   └── dashboard/            # Dashboard components
│   │   ├── lib/
│   │   │   ├── db/                   # Database client
│   │   │   ├── auth/                 # Auth configuration
│   │   │   ├── storage/              # Storage client
│   │   │   ├── ai/                   # AI clients
│   │   │   └── utils/                # Utility functions
│   │   ├── hooks/
│   │   │   ├── useEditor.ts
│   │   │   ├── usePresentation.ts
│   │   │   └── useAI.ts
│   │   ├── stores/
│   │   │   ├── editor.ts
│   │   │   └── presentation.ts
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── types/
│   │   │   ├── presentation.ts
│   │   │   ├── editor.ts
│   │   │   └── ai.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── next.config.js
│   └── admin/                        # Admin dashboard (optional separate app)
├── packages/
│   ├── ai/                           # AI package
│   │   ├── src/
│   │   │   ├── providers/
│   │   │   │   ├── openai.ts
│   │   │   │   ├── anthropic.ts
│   │   │   │   └── index.ts
│   │   │   ├── prompts/
│   │   │   │   ├── generation.ts
│   │   │   │   ├── design.ts
│   │   │   │   └── summarization.ts
│   │   │   ├── parsers/
│   │   │   │   └── presentation-parser.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── canvas/                       # Canvas package (Konva.js wrapper)
│   │   ├── src/
│   │   │   ├── core/
│   │   │   │   ├── stage.ts
│   │   │   │   ├── layer.ts
│   │   │   │   └── element.ts
│   │   │   ├── elements/
│   │   │   │   ├── text.ts
│   │   │   │   ├── image.ts
│   │   │   │   ├── shape.ts
│   │   │   │   └── video.ts
│   │   │   ├── animation/
│   │   │   │   └── animator.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── global-map/                   # Global presentation map (tldraw wrapper)
│   │   ├── src/
│   │   │   ├── core/
│   │   │   │   ├── map-engine.ts
│   │   │   │   └── camera.ts
│   │   │   ├── modes/
│   │   │   │   ├── tree-mode.ts
│   │   │   │   ├── flow-mode.ts
│   │   │   │   ├── cluster-mode.ts
│   │   │   │   ├── spiral-mode.ts
│   │   │   │   └── constellation-mode.ts
│   │   │   ├── shapes/
│   │   │   │   └── slide-shape.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── design/                       # Design intelligence package
│   │   ├── src/
│   │   │   ├── typography/
│   │   │   │   ├── scale-generator.ts
│   │   │   │   └── font-pairing.ts
│   │   │   ├── colors/
│   │   │   │   ├── palette-generator.ts
│   │   │   │   └── harmony-engine.ts
│   │   │   ├── layouts/
│   │   │   │   ├── layout-selector.ts
│   │   │   │   └── template-library.ts
│   │   │   ├── assets/
│   │   │   │   ├── image-selector.ts
│   │   │   │   └── icon-selector.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── storage/                      # Storage package
│   │   ├── src/
│   │   │   ├── s3-client.ts
│   │   │   ├── asset-manager.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── database/                     # Database package (Prisma)
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── repositories/
│   │   │   │   ├── presentation.ts
│   │   │   │   ├── user.ts
│   │   │   │   └── asset.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── shared/                      # Shared utilities and types
│       ├── src/
│       │   ├── types/
│       │   │   ├── presentation.ts
│       │   │   ├── element.ts
│       │   │   └── animation.ts
│       │   ├── constants/
│       │   │   └── design-system.ts
│       │   ├── utils/
│       │   │   └── helpers.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── .env.example
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## API Routes Design

### REST API Structure

```
/api/
├── auth/
│   ├── POST   /register
│   ├── POST   /login
│   ├── POST   /logout
│   ├── GET    /me
│   └── POST   /refresh
├── presentations/
│   ├── GET    /                    # List presentations
│   ├── POST   /                    # Create presentation
│   ├── GET    /[id]                # Get presentation
│   ├── PUT    /[id]                # Update presentation
│   ├── DELETE /[id]                # Delete presentation
│   ├── POST   /[id]/duplicate      # Duplicate presentation
│   ├── GET    /[id]/versions       # Get version history
│   ├── POST   /[id]/versions       # Create version
│   └── GET    /[id]/export/[format] # Export presentation
├── ai/
│   ├── POST   /generate            # Generate presentation
│   ├── POST   /rewrite             # Rewrite content
│   ├── POST   /summarize           # Summarize content
│   ├── POST   /design              # Apply design
│   ├── POST   /assets              # Suggest assets
│   └── POST   /notes               # Generate speaker notes
├── assets/
│   ├── POST   /upload              # Upload asset
│   ├── GET    /search              # Search assets
│   ├── GET    /[id]                # Get asset
│   └── DELETE /[id]                # Delete asset
├── storage/
│   ├── POST   /presigned-url       # Get presigned upload URL
│   └── POST   /optimize            # Optimize asset
└── admin/
    ├── GET    /users               # List users
    ├── GET    /usage               # Get usage stats
    ├── GET    /providers           # Get AI providers
    ├── PUT    /providers           # Update providers
    └── GET    /features            # Get feature flags
```

### WebSocket API (Future Collaboration)

```
/ws/presentation/[id]
├── Events:
│   ├── user:join                  # User joined
│   ├── user:leave                 # User left
│   ├── cursor:move                # Cursor movement
│   ├── element:create             # Element created
│   ├── element:update             # Element updated
│   ├── element:delete             # Element deleted
│   ├── selection:change           # Selection changed
│   └── document:sync              # Document sync
```

---

## Component Map

### Editor Components

```
EditorPage
├── EditorLayout
│   ├── Toolbar
│   │   ├── ToolButtons
│   │   ├── ZoomControls
│   │   └── UndoRedo
│   ├── CanvasContainer
│   │   ├── KonvaStage
│   │   │   ├── KonvaLayer
│   │   │   │   ├── TextElement
│   │   │   │   ├── ImageElement
│   │   │   │   ├── ShapeElement
│   │   │   │   └── VideoElement
│   │   │   └── SelectionLayer
│   │   └── GridOverlay
│   └── SidePanel
│       ├── PropertiesPanel
│       ├── LayersPanel
│       ├── AssetsPanel
│       └── TemplatesPanel
└── SlideSorter
```

### Presentation Components

```
PresentationPlayer
├── PlayerControls
│   ├── PlayPause
│   ├── Progress
│   ├── Navigation
│   └── ModeSelector
├── PresentationCanvas
│   ├── ClassicMode
│   ├── ZoomMode
│   └── StoryMode
├── PresenterView
│   ├── CurrentSlide
│   ├── NextSlide
│   ├── SpeakerNotes
│   └── Timer
└── GlobalMap
    ├── MapCanvas
    ├── PathVisualization
    └── MiniMap
```

---

## AI Pipeline Architecture

### Provider Abstraction Layer

```typescript
interface AIProvider {
  name: string;
  generatePresentation(input: GenerationInput): Promise<PresentationDocument>;
  generateDesign(content: Content): Promise<DesignSystem>;
  rewriteContent(content: string, instruction: string): Promise<string>;
  summarizeContent(content: string): Promise<string>;
  generateAssets(context: AssetContext): Promise<AssetSuggestion[]>;
}

class OpenAIProvider implements AIProvider {
  // Implementation
}

class AnthropicProvider implements AIProvider {
  // Implementation
}

class AIManager {
  private providers: Map<string, AIProvider>;
  
  constructor() {
    this.providers = new Map();
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('anthropic', new AnthropicProvider());
  }
  
  getProvider(name: string): AIProvider {
    return this.providers.get(name);
  }
  
  async generatePresentation(input: GenerationInput, provider?: string): Promise<PresentationDocument> {
    const aiProvider = this.getProvider(provider || this.defaultProvider);
    return aiProvider.generatePresentation(input);
  }
}
```

### Prompt Engineering Strategy

**System Prompts**:
- Role definition: "You are an expert presentation designer and storyteller"
- Output format: Strict JSON schema
- Design principles: Emphasize visual quality, readability, professional aesthetics
- Context awareness: Consider audience, purpose, tone

**Prompt Templates**:
1. Structure Generation: Analyze content and determine optimal slide structure
2. Content Generation: Generate slide content with hierarchy
3. Design Application: Apply design system based on content type
4. Asset Selection: Select relevant assets based on context
5. Global Map: Determine spatial arrangement based on narrative flow

### Quality Validation

- Content coherence validation
- Design consistency checks
- Asset relevance scoring
- Readability analysis
- Accessibility compliance

---

## Canvas Architecture

### Konva.js Integration Strategy

**Stage Management**:
```typescript
class PresentationStage {
  private stage: Konva.Stage;
  private layers: Map<string, Konva.Layer>;
  
  constructor(container: string, width: number, height: number) {
    this.stage = new Konva.Stage({
      container,
      width,
      height
    });
    this.layers = new Map();
  }
  
  addLayer(id: string, layer: Konva.Layer) {
    this.layers.set(id, layer);
    this.stage.add(layer);
  }
  
  getLayer(id: string): Konva.Layer {
    return this.layers.get(id);
  }
}
```

**Element Rendering**:
- Text elements with rich formatting
- Image elements with filters and blending
- Shape elements with custom paths
- Video elements with playback controls
- Group elements for composition

**Performance Optimization**:
- Shape caching for complex elements
- Layer management for optimal rendering
- Virtualization for large presentations
- RequestAnimationFrame for smooth animations
- Offscreen canvas for background rendering

### tldraw Integration for Global Map

**Custom Shapes**:
- Slide shape with preview thumbnail
- Connection lines for narrative paths
- Section grouping shapes
- Camera path visualization

**Interaction Model**:
- Pan and zoom navigation
- Click to navigate to slide
- Drag to rearrange slides
- AI auto-arrangement

**Camera System**:
```typescript
class CameraController {
  private position: { x: number; y: number };
  private zoom: number;
  private targetPosition: { x: number; y: number };
  private targetZoom: number;
  
  animateTo(target: { x: number; y: number; zoom: number }, duration: number) {
    // Smooth camera animation using easing
  }
  
  followPath(path: CameraPath[]) {
    // Follow predefined camera path
  }
}
```

---

## Presentation Renderer

### Rendering Modes

**Classic Mode**:
- Traditional slide-by-slide
- Fade/slide transitions
- Full-screen display
- Keyboard navigation

**Zoom Mode**:
- Spatial navigation
- Smooth camera movements
- Context preservation
- Mini-map for orientation

**Story Mode**:
- Progressive content reveal
- Typing animations
- Line-by-line display
- Section-by-section flow

### Animation System

```typescript
interface AnimationConfig {
  type: 'fade' | 'slide' | 'zoom' | 'typewriter' | 'custom';
  duration: number;
  easing: string;
  delay?: number;
}

class AnimationEngine {
  private timeline: AnimationTimeline;
  
  play(animations: AnimationConfig[]) {
    // Play animations in sequence or parallel
  }
  
  pause() {
    // Pause current animation
  }
  
  seek(time: number) {
    // Seek to specific time
  }
}
```

---

## Storage Design

### S3-Compatible Storage Strategy

**Bucket Structure**:
```
prestili/
├── presentations/
│   ├── [userId]/
│   │   ├── [presentationId]/
│   │   │   ├── exports/
│   │   │   └── thumbnails/
├── assets/
│   ├── images/
│   ├── videos/
│   ├── icons/
│   └── uploads/
└── temp/
    └── uploads/
```

**Asset Lifecycle**:
1. User uploads to temp bucket with presigned URL
2. System processes and optimizes asset
3. Asset moved to permanent bucket
4. Metadata stored in database
5. CDN distribution enabled

**Optimization Pipeline**:
- Image compression (WebP format)
- Thumbnail generation
- Video transcoding
- Format conversion

### CDN Integration

- Cloudflare CDN for global distribution
- Cache headers for assets
- Purge API for updates
- Edge caching for static content

---

## Security Model

### Authentication Strategy

**Recommended**: NextAuth.js (Auth.js)

**Features**:
- OAuth providers (Google, GitHub, etc.)
- Email/password authentication
- Session management
- CSRF protection
- Secure cookies

```typescript
// apps/web/lib/auth/config.ts
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ... other providers
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};
```

### Authorization Model

**Role-Based Access Control (RBAC)**:
- User: Can create and edit own presentations
- Pro User: Enhanced features, higher limits
- Enterprise: Team collaboration, admin features
- Admin: Full system access

**Resource-Based Access**:
- Presentation ownership
- Share permissions (view, edit, comment)
- Expiration-based access

### Data Encryption

- Transport: TLS 1.3
- At rest: AES-256
- Secrets: Environment variables, secret management service
- PII: Encrypted fields in database

### API Security

- Rate limiting per user
- Input validation and sanitization
- SQL injection prevention (Prisma)
- XSS prevention (React sanitization)
- CORS configuration
- API key authentication for internal services

---

## Performance Plan

### Caching Strategy

**Application Level**:
- React Query for data caching
- SWR for real-time data
- Memoization for expensive computations
- Component memoization

**Database Level**:
- Connection pooling
- Query result caching
- JSONB GIN indexes
- Partial indexes for common queries

**CDN Level**:
- Static asset caching
- API response caching (GET requests)
- Edge caching for global distribution

### Lazy Loading

- Code splitting with React.lazy
- Route-based splitting with Next.js
- Component-level lazy loading
- Image lazy loading with next/image

### Optimization Techniques

**Canvas Performance**:
- Shape caching
- Layer management
- Virtualization
- Offscreen rendering
- RequestAnimationFrame

**Database Performance**:
- Query optimization
- Index strategy
- Connection pooling
- Read replicas (future)
- Query batching

**AI Performance**:
- Request batching
- Response caching
- Streaming responses
- Provider selection based on complexity

---

## Deployment Architecture

### Container Strategy

**Docker Compose (Development)**:
```yaml
services:
  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
      - STORAGE_ENDPOINT=...
    depends_on:
      - db
      - minio
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=prestili
      - POSTGRES_USER=prestili
      - POSTGRES_PASSWORD=secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  minio:
    image: minio/minio
    command: server /data
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  minio_data:
```

**Kubernetes (Production)**:
- Horizontal Pod Autoscaling
- Rolling updates
- ConfigMaps and Secrets
- Ingress controller
- Persistent volumes

### CI/CD Pipeline

**GitHub Actions**:
1. On push: Run tests, lint, type check
2. On PR: Run full test suite, security scan
3. On main: Build Docker images, push to registry
4. On release: Deploy to staging, run E2E tests
5. Manual approval: Deploy to production

### Monitoring Strategy

**Application Monitoring**:
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics / New Relic)
- Uptime monitoring (Pingdom)
- Log aggregation (Datadog Logs)

**Business Metrics**:
- User acquisition
- Presentation creation rate
- AI generation success rate
- Feature usage
- Storage usage

---

## Testing Strategy

### Unit Testing

**Tools**: Jest, React Testing Library

**Coverage**:
- AI package: 90%
- Canvas package: 85%
- Design package: 85%
- Database package: 90%
- Shared utilities: 95%

### Integration Testing

**Tools**: Playwright, Supertest

**Scenarios**:
- Presentation creation flow
- AI generation flow
- Asset upload flow
- Authentication flow
- API endpoint testing

### E2E Testing

**Tools**: Playwright

**Critical Paths**:
- User registration → Create presentation → AI generate → Edit → Present
- Upload asset → Apply to slide → Export
- Share presentation → View as guest

### Performance Testing

**Tools**: k6, Lighthouse

**Metrics**:
- Page load time
- Time to interactive
- Canvas rendering FPS
- API response times
- AI generation time

---

## Monitoring System

### Logging

**Structured Logging**:
```typescript
logger.info('presentation_created', {
  userId: user.id,
  presentationId: presentation.id,
  method: 'ai',
  duration: 1234,
});
```

**Log Levels**:
- ERROR: Critical errors requiring immediate attention
- WARN: Warning conditions
- INFO: Informational messages
- DEBUG: Detailed debugging information

### Metrics

**Application Metrics**:
- Request rate
- Error rate
- Response time percentiles
- Active users
- Presentation creation rate

**Business Metrics**:
- Daily active users
- Presentations created
- AI generations
- Storage usage
- Subscription conversions

### Alerting

**Alert Conditions**:
- Error rate > 5%
- Response time p95 > 1s
- Database connection pool exhausted
- AI API rate limits
- Storage capacity > 80%

**Notification Channels**:
- Slack for development team
- Email for on-call
- PagerDuty for critical alerts

---

## Implementation Roadmap

### Phase 1: Research + Architecture (Week 1-2)
- [x] Research existing platforms
- [x] Analyze strengths and weaknesses
- [x] Design system architecture
- [x] Define data models
- [x] Create technical specifications
- [x] Set up development environment
- [x] Initialize monorepo structure

### Phase 2: Core Editor (Week 3-6)
- Set up Next.js application with App Router
- Implement authentication with NextAuth.js
- Set up PostgreSQL with Prisma
- Create basic editor UI with Konva.js
- Implement element creation (text, shapes, images)
- Add drag-and-drop functionality
- Implement resize and rotation
- Add layer management
- Implement undo/redo
- Add basic styling options
- Implement save/load functionality

### Phase 3: AI Generation (Week 7-10)
- Set up AI provider abstraction layer
- Implement OpenAI integration
- Create prompt templates
- Implement content analysis
- Build structure generation
- Implement content generation
- Add design system application
- Implement asset selection
- Create global map generation
- Add quality validation
- Implement streaming responses

### Phase 4: Presentation Rendering (Week 11-14)
- Implement classic slide mode
- Build zoom mode with camera animations
- Create story mode with progressive reveal
- Implement animation system
- Add presenter view
- Implement keyboard navigation
- Add full-screen mode
- Create export functionality (PDF, PPTX)
- Implement sharing mechanism

### Phase 5: Design Intelligence (Week 15-18)
- Implement typography engine
- Build color harmony system
- Create layout selector
- Implement image blending
- Add asset context awareness
- Create design templates
- Implement style suggestions
- Add accessibility checks

### Phase 6: Admin & Settings (Week 19-20)
- Build admin dashboard
- Implement user management
- Add provider configuration
- Create system prompt management
- Implement usage analytics
- Add feature flags
- Create settings system
- Implement environment validation

### Phase 7: Optimization (Week 21-22)
- Implement caching strategy
- Add lazy loading
- Optimize canvas performance
- Implement CDN integration
- Add image optimization
- Optimize database queries
- Implement compression
- Add performance monitoring

### Phase 8: Production Readiness (Week 23-24)
- Implement comprehensive testing
- Add error monitoring
- Set up CI/CD pipeline
- Configure production environment
- Implement backup strategy
- Add security hardening
- Create documentation
- Perform load testing
- Launch beta
- Gather feedback
- Iterate and improve

---

## Conclusion

This architecture provides a comprehensive foundation for building Prestili, a next-generation AI-native presentation platform. The design emphasizes:

1. **Visual Quality**: Every decision optimizes for visual storytelling and professional design
2. **AI-Native**: AI is integrated from the ground up, not bolted on
3. **Spatial Innovation**: Global presentation map with multiple structure modes
4. **Performance**: Optimized for smooth animations and responsive editing
5. **Scalability**: Designed to grow from MVP to enterprise scale
6. **Maintainability**: Clean architecture with separated concerns

The implementation roadmap provides a clear path from research to production, with each phase building on the previous one. The modular design allows for iterative development and easy feature additions.

**Next Steps**: Review and approve architecture, begin Phase 2 implementation.
