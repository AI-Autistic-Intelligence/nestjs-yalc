/**
 * @file jest.resolver.ts
 * @description Converted to TypeScript to support NodeNext module resolution.
 */
import path  from 'path';

export default (request, options) => {
  if (request.endsWith('.js')) {
    const isLocal = request.startsWith('.');
    // Also allow absolute paths mapped by Jest that are outside node_modules
    const isAbsoluteProjectFile = path.isAbsolute(request) && !request.includes('node_modules');
    
    if (isLocal || isAbsoluteProjectFile) {
      const tsRequest = request.replace(/\.js$/, '.ts');
      try {
        return options.defaultResolver(tsRequest, options);
      } catch (e) {
        // Ignore and fallback
      }
    }
  }

  return options.defaultResolver(request, options);
};
