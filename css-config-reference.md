# CSS Configuration Reference

## Design System Configuration

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap');
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));

@theme {
  --color-background: #ffffff;
  --color-foreground: #1e293b;

  --color-card: #ffffff;
  --color-card-foreground: #1e293b;

  --color-popover: #ffffff;
  --color-popover-foreground: #1e293b;

  --color-primary: #0f766e;
  --color-primary-foreground: #ffffff;

  --color-secondary: #f8fafc;
  --color-secondary-foreground: #475569;

  --color-muted: #f8fafc;
  --color-muted-foreground: #64748b;

  --color-accent: #f8fafc;
  --color-accent-foreground: #1e293b;

  --color-destructive: #dc2626;
  --color-destructive-foreground: #ffffff;

  --color-border: #e2e8f0;
  --color-input: #e2e8f0;
  --color-ring: #0f766e;

  --color-chart-1: #0f766e;
  --color-chart-2: #166534;
  --color-chart-3: #1e293b;
  --color-chart-4: #475569;
  --color-chart-5: #64748b;

  --color-sidebar: #f8fafc;
  --color-sidebar-foreground: #475569;
  --color-sidebar-primary: #1e293b;
  --color-sidebar-primary-foreground: #ffffff;
  --color-sidebar-accent: #f1f5f9;
  --color-sidebar-accent-foreground: #1e293b;
  --color-sidebar-border: #e2e8f0;
  --color-sidebar-ring: #0f766e;

  --color-navy: #1e293b;
  --color-gray: #475569;
  --color-teal: #0f766e;
  --color-success: #166534;
  --color-muted-bg: #f8fafc;
  --color-light-gray: #64748b;

  --font-display: "Inter", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --radius-lg: 0.5rem;
  --radius-md: calc(0.5rem - 2px);
  --radius-sm: calc(0.5rem - 4px);

  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  @keyframes accordion-down {
    from {
      height: 0;
    }
    to {
      height: var(--radix-accordion-content-height);
    }
  }
  @keyframes accordion-up {
    from {
      height: var(--radix-accordion-content-height);
    }
    to {
      height: 0;
    }
  }
}

@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: #e2e8f0;
  }
}

@layer base {
  :root {
    --background: #ffffff;
    --foreground: #1e293b;
    --card: #ffffff;
    --card-foreground: #1e293b;
    --popover: #ffffff;
    --popover-foreground: #1e293b;
    --primary: #0f766e;
    --primary-foreground: #ffffff;
    --secondary: #f8fafc;
    --secondary-foreground: #475569;
    --muted: #f8fafc;
    --muted-foreground: #64748b;
    --accent: #f8fafc;
    --accent-foreground: #1e293b;
    --destructive: #dc2626;
    --destructive-foreground: #ffffff;
    --border: #e2e8f0;
    --input: #e2e8f0;
    --ring: #0f766e;
    --chart-1: #0f766e;
    --chart-2: #166534;
    --chart-3: #1e293b;
    --chart-4: #475569;
    --chart-5: #64748b;
    --radius: 0.5rem;
    --sidebar-background: #f8fafc;
    --sidebar-foreground: #475569;
    --sidebar-primary: #1e293b;
    --sidebar-primary-foreground: #ffffff;
    --sidebar-accent: #f1f5f9;
    --sidebar-accent-foreground: #1e293b;
    --sidebar-border: #e2e8f0;
    --sidebar-ring: #0f766e;
  }
}

@layer base {
  * {
    border-color: var(--color-border);
  }

  html {
    font-size: 16px;
    line-height: 1.6;
    font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
  }

  body {
    font-family: var(--font-body);
    background-color: var(--color-background);
    color: var(--color-foreground);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.025em;
    color: var(--color-navy);
  }

  h1 {
    font-size: 3rem;
    font-weight: 700;
  }

  h2 {
    font-size: 2.25rem;
    font-weight: 600;
  }

  h3 {
    font-size: 1.875rem;
    font-weight: 600;
  }

  h4 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--color-gray);
  }

  .font-display {
    font-family: var(--font-display);
  }

  .font-body {
    font-family: var(--font-body);
  }

  .font-mono {
    font-family: var(--font-mono);
  }

  .container {
    margin-inline: auto;
    padding-inline: 2rem;
    max-width: 1200px;
  }
}
```

## Key Features

### Color Palette
- **Primary**: Teal (#0f766e)
- **Secondary**: Light gray (#f8fafc)
- **Navy**: Dark blue (#1e293b)
- **Gray**: Medium gray (#475569)
- **Success**: Green (#166534)
- **Destructive**: Red (#dc2626)

### Typography
- **Display Font**: Inter (for headings)
- **Body Font**: Inter (for body text)
- **Mono Font**: JetBrains Mono (for code)

### Design Tokens
- Custom CSS variables for consistent theming
- Responsive container system
- Border radius system
- Animation keyframes
- Sidebar-specific styling

### Usage Notes
- This configuration provides a complete design system
- Can be used to replace or enhance existing Tailwind CSS setup
- Includes dark mode support structure
- Provides consistent spacing and typography scales

## Implementation
To use this configuration:
1. Replace the existing CSS in `src/app/globals.css`
2. Update component styling to use the new color variables
3. Ensure all UI components reference the new design tokens
