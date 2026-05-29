declare const __APP_NAME__: string;
declare const __APP_VERSION__: string;

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
