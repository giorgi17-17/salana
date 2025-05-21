# CSS Modules Structure

This project uses CSS Modules for styling components. CSS Modules provide local scoping of CSS, making it easier to avoid conflicts and manage styles in a modular way.

## Directory Structure

```
styles/
├── globals.css        # Global styles applied to the entire application
├── components/        # CSS modules for individual components
│   ├── Hero.module.css
│   ├── Testimonials.module.css
│   └── ...
└── README.md          # This file
```

## Usage

### Global Styles

Global styles are defined in `globals.css` and imported in `index.css`. These styles apply to the entire application and include:

- Reset styles
- Typography defaults
- Common utility classes (like `.container`)
- Base element styles

### Component Styles

Component-specific styles are defined in CSS modules located in the `components/` directory. Each component has its own CSS module file named according to the pattern: `ComponentName.module.css`.

To use a CSS module in a component:

```jsx
// Import the CSS module
import styles from "../../styles/components/ComponentName.module.css";

// Use the styles in your component
function ComponentName() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Title</h1>
      {/* ... */}
    </div>
  );
}
```

## Conventions

- Use camelCase for class names in CSS modules (e.g., `.heroSection`, `.buttonContainer`)
- Group related styles together
- Use media queries inside the CSS module for responsive styles
- Include comments for color values (e.g., `/* emerald-900 */`)
- Use semantic class names that describe the purpose rather than the appearance
