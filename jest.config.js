/** @type {import('jest').Config} */
export default {  
  preset: "ts-jest/presets/default-esm", // Evite l'erreur "Cannot use import statement outside a module pour les tests en TypeScript" 
  testEnvironment: "node",  // environnement de test pour les applications Node.js
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true, 
        isolatedModules: true,  
      },
    ],
  }, // permet de transformer les fichiers TypeScript en JavaScript
  extensionsToTreatAsEsm: [".ts"],  // Indique à Jest de traiter les fichiers .ts comme des modules ESM
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Permet de résoudre les imports relatifs avec l'extension .js
  },
  verbose: true,  // Affiche des informations détaillées lors de l'exécution des tests
  detectOpenHandles: true,  // Aide à détecter les ressources non fermées après les tests
}

