# Mermaid Configuration Reference

This file contains reusable Mermaid diagram configurations for slides.

## Standard Flowchart Config (Dark Theme)

```
%%{init: {'theme': 'dark', 'themeVariables': {
  'primaryColor': '#0f1f3d',
  'primaryBorderColor': '#60a5fa',
  'primaryTextColor': '#e2e8f0',
  'secondaryColor': '#102b4c',
  'tertiaryColor': '#143860',
  'lineColor': '#5eead4',
  'fontFamily': 'Inter, Segoe UI, sans-serif'
}, 'flowchart': {'curve': 'basis', 'htmlLabels': true, 'useMaxWidth': true, 'nodeSpacing': 35, 'rankSpacing': 40}}%%
```

## Common ClassDef Styles

### Standard Node Types

```
classDef hub fill:#0b2540,stroke:#60a5fa,stroke-width:2px,color:#f8fafc,rx:14px,ry:14px;
classDef category fill:#133661,stroke:#5eead4,stroke-width:2px,color:#e2e8f0,rx:12px,ry:12px;
classDef detail fill:#0f4c81,stroke:#93c5fd,stroke-width:2px,color:#e2e8f0,rx:12px,ry:12px;
classDef process fill:#0f4c81,stroke:#93c5fd,stroke-width:2px,color:#e2e8f0,rx:12px,ry:12px;
classDef output fill:#155e75,stroke:#5eead4,stroke-width:2px,color:#e2e8f0,rx:12px,ry:12px;
classDef input fill:#133661,stroke:#5eead4,stroke-width:2px,color:#e2e8f0,rx:12px,ry:12px;
classDef decision fill:#0b2540,stroke:#fcd34d,stroke-width:2px,color:#fef3c7,rx:14px,ry:14px;
classDef branch fill:#132f5d,stroke:#38bdf8,stroke-width:2px,color:#e2e8f0,rx:12px,ry:12px;
classDef event fill:#0f4c81,stroke:#93c5fd,stroke-width:2px,color:#e0f2fe,rx:12px,ry:12px;
classDef example fill:#1d3a64,stroke:#38bdf8,stroke-width:1.5px,color:#e2e8f0,rx:12px,ry:12px;
classDef positive fill:#0f4c81,stroke:#5eead4,stroke-width:2px,color:#e0f2fe,rx:12px,ry:12px;
classDef alert fill:#b45309,stroke:#ffb74d,stroke-width:2px,color:#fff7ed,rx:12px,ry:12px;
classDef negative fill:#8b2f39,stroke:#f87171,stroke-width:2px,color:#fee2e2,rx:12px,ry:12px;
classDef support fill:#0f2b4c,stroke:#5eead4,stroke-width:2px,color:#e2e8f0,rx:14px,ry:14px;
classDef option fill:#155e75,stroke:#5eead4,stroke-width:2px,color:#e0f2fe,rx:10px,ry:10px;
```

## Simplified Init (Minimal)

For cleaner code, use this minimal version and add custom classDefs as needed:

```
%%{init: {'theme': 'dark', 'flowchart': {'htmlLabels': true, 'useMaxWidth': true}}}%%
```

## Usage Guidelines

1. **Copy the standard config** for consistent theming across diagrams
2. **Adjust nodeSpacing and rankSpacing** based on diagram complexity:
   - Tight: 30-35 (nodeSpacing), 35-40 (rankSpacing)
   - Normal: 35-40 (nodeSpacing), 40-50 (rankSpacing)
   - Loose: 40-50 (nodeSpacing), 50-60 (rankSpacing)
3. **Choose appropriate classDefs** from the common styles above
4. **Customize colors** by modifying the hex values in themeVariables

## Color Palette Reference

- **Primary Blue**: #0f1f3d (backgrounds), #60a5fa (borders)
- **Teal/Cyan**: #5eead4 (accents, lines)
- **Light Text**: #e2e8f0, #f8fafc
- **Success Green**: #0f4c81 (with #5eead4 stroke)
- **Warning Orange**: #b45309 (with #ffb74d stroke)
- **Error Red**: #8b2f39 (with #f87171 stroke)
- **Info Cyan**: #38bdf8
