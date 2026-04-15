# Theme Directory

This directory contains the custom theme, styles, and configuration for the lecture slides.

## Directory Structure

```
theme/
├── README.md                 # This file
├── mermaid-config.md        # Mermaid diagram configuration reference
├── layoutHelper.ts          # Layout helper utilities
├── package.json             # Theme package configuration
├── layouts/                 # Custom slide layouts
└── styles/
    ├── index.ts             # Style imports (entry point)
    ├── layouts.css          # Layout-specific styles
    ├── custom-slides.css    # Main custom slide styles (cards, grids, etc.)
    └── mermaid-styles.css   # Mermaid diagram styles
```

## Usage

### Cards

Cards are styled containers for content. See `styles/custom-slides.css` for full documentation.

```html
<div class="card card-primary pad-tight">
  <h2>Title</h2>
  <div class="card-content">Content here</div>
</div>
```

**Available card types:**
- `card-primary` - Blue theme
- `card-secondary` - Secondary blue
- `card-accent` - Teal/cyan accent
- `card-success` - Green theme
- `card-warning` - Orange/yellow theme
- `card-info` - Light blue theme

**Padding modifiers:**
- `pad-tight` - Minimal padding (0.8rem 1rem)
- `pad-snug` - Snug padding (0.8rem 1.2rem)
- `pad-compact` - Very compact (0.7rem 0.9rem)
- `pad-balanced` - Balanced padding (0.9rem 1.1rem)

### Grids

```html
<div class="grid-2 gap-md">
  <div class="card card-primary">Column 1</div>
  <div class="card card-secondary">Column 2</div>
</div>
```

**Grid types:**
- `grid-2` (2 columns)
- `grid-3` (3 columns)
- `grid-auto` (single column)
- `grid-2-large` (2 columns with large 3rem gap)
- `stack-tight` (vertical stack with tight gap - useful for lists of cards)

### Mermaid Diagrams

For Mermaid diagrams, refer to `mermaid-config.md` for:
- Standard theme configuration
- Common classDef styles
- Color palette reference
- Usage guidelines

The init block can be simplified to a single line for cleaner code.

### Spacing Utilities

- **Margin top:** `mt-xs`, `mt-sm`, `mt-md`, `mt-lg`, `mt-xl`, `mt-xxl`
- **Margin bottom:** `mb-sm`, `mb-md`, `mb-lg`
- **Gap:** `gap-tight`, `gap-md` (used with grids)

### Dice/Number Boxes

For displaying colored numbered boxes (like dice or sample spaces):

```html
<div class="dice-grid">
  <div class="dice-box dice-box-primary">1</div>
  <div class="dice-box dice-box-success">2</div>
  <div class="dice-box dice-box-info">3</div>
</div>
<div class="caption-text">Explanatory text below</div>
```

**Available colors:** `dice-box-primary`, `dice-box-success`, `dice-box-info`, `dice-box-warning`, `dice-box-accent`

### Typography

- **Size:** `text-sm`, `text-base`, `text-md`, `text-lg`
- **Special:** `text-tight`, `text-xl-strong`, `mono-strong`, `meta-caption`, `note-text`, `caption-text`

## Customization

### Changing Colors

Edit CSS variables in `styles/custom-slides.css`:

```css
:root {
  --color-primary: #031633;
  --color-accent: #042f4e;
  /* ... */
}
```

### Changing Mermaid Theme

Edit the init block in your mermaid diagrams, or reference the standard config in `mermaid-config.md`.

## Best Practices

1. **Keep slides clean** - Use semantic classes instead of inline styles
2. **Use padding modifiers** - Prevent content overflow with `pad-tight`
3. **Reference configs** - Copy from `mermaid-config.md` for consistency
4. **Maintain hierarchy** - Use appropriate card types for visual importance
5. **Test responsiveness** - Check slides at different viewport sizes

## File Organization

- **Styles are modular** - Each CSS file has a specific purpose
- **Configuration is separate** - Mermaid config lives in its own file
- **Documentation inline** - Check CSS files for detailed usage comments

## Contributing

When adding new styles:
1. Add to appropriate CSS file (or create new one if needed)
2. Update `styles/index.ts` to import new stylesheets
3. Document usage in CSS comments
4. Update this README if adding new patterns
