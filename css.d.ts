// Declaración para imports de estilos con side effects (p. ej. `./globals.css`).
// Sin esto tsc reporta TS2307: el archivo existe pero TS no sabe tipar `.css`.
declare module "*.css";
