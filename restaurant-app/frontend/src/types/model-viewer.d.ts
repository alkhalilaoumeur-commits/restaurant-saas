// TypeScript-Deklaration für Google's <model-viewer> Web Component
// Docs: https://modelviewer.dev/docs/
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        poster?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        'auto-rotate'?: boolean | string;
        'camera-controls'?: boolean | string;
        'touch-action'?: string;
        'interaction-prompt'?: 'auto' | 'none';
        'shadow-intensity'?: string;
        'shadow-softness'?: string;
        exposure?: string;
        'environment-image'?: string;
        'camera-orbit'?: string;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        'field-of-view'?: string;
        ar?: boolean | string;
        'ar-modes'?: string;
      },
      HTMLElement
    >;
  }
}
