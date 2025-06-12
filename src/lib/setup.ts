// Global setup for BigInt serialization
if (typeof BigInt !== 'undefined') {
  (BigInt.prototype as any).toJSON = function() {
    return this.toString();
  };
}

// Export to ensure this file is imported
export {};