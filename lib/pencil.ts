/**
 * Pencil class that simulates the durability and functionality of a real pencil
 * Following TDD principles with comprehensive test coverage
 */
export class Pencil {
  private _pointDurability: number;
  private _length: number;
  private _eraserDurability: number;
  private readonly _initialPointDurability: number;
  private readonly _initialLength: number;
  private readonly _initialEraserDurability: number;

  constructor(
    pointDurability: number = 100,
    length: number = 10,
    eraserDurability: number = 50
  ) {
    this._pointDurability = pointDurability;
    this._length = length;
    this._eraserDurability = eraserDurability;
    this._initialPointDurability = pointDurability;
    this._initialLength = length;
    this._initialEraserDurability = eraserDurability;
  }

  get pointDurability(): number {
    return this._pointDurability;
  }

  get length(): number {
    return this._length;
  }

  get eraserDurability(): number {
    return this._eraserDurability;
  }

  get isSharp(): boolean {
    return this._pointDurability > 0;
  }

  get canErase(): boolean {
    return this._eraserDurability > 0;
  }

  get canSharpen(): boolean {
    return this._length > 0 && this._pointDurability < this._initialPointDurability;
  }

  /**
   * Writes text with the pencil, degrading point durability
   * Uppercase letters degrade by 2 points, lowercase by 1 point
   * Spaces and special characters don't degrade the pencil
   */
  write(text: string): string {
    let result = '';
    
    for (const char of text) {
      if (this._pointDurability <= 0) {
        result += ' '; // Can't write when point is dull
        continue;
      }

      if (char === ' ' || /[^a-zA-Z]/.test(char)) {
        result += char; // Spaces and special characters don't degrade pencil
      } else if (char === char.toUpperCase()) {
        // Uppercase letters degrade by 2 points
        if (this._pointDurability >= 2) {
          result += char;
          this._pointDurability -= 2;
        } else {
          result += ' ';
          this._pointDurability = 0;
        }
      } else {
        // Lowercase letters degrade by 1 point
        result += char;
        this._pointDurability -= 1;
      }
    }

    return result;
  }

  /**
   * Sharpens the pencil, restoring point durability but reducing length
   */
  sharpen(): boolean {
    if (!this.canSharpen) {
      return false;
    }

    this._pointDurability = this._initialPointDurability;
    this._length -= 1;
    return true;
  }

  /**
   * Erases text from the given position, degrading eraser durability
   * Each character erased reduces eraser durability by 1
   */
  erase(text: string, textToErase: string): string {
    if (!this.canErase || !textToErase) {
      return text;
    }

    const lastIndex = text.lastIndexOf(textToErase);
    if (lastIndex === -1) {
      return text;
    }

    let charactersToErase = Math.min(textToErase.length, this._eraserDurability);
    this._eraserDurability -= charactersToErase;

    // Erase from right to left
    const beforeErase = text.substring(0, lastIndex);
    const afterErase = text.substring(lastIndex + textToErase.length);
    const partiallyErased = ' '.repeat(charactersToErase) + 
                           textToErase.substring(charactersToErase);

    return beforeErase + partiallyErased + afterErase;
  }

  /**
   * Edits text by writing in erased spaces
   * Degradation occurs when writing over non-space characters
   */
  edit(text: string, newText: string, position: number): string {
    if (!this.isSharp) {
      return text;
    }

    let result = text.split('');
    
    for (let i = 0; i < newText.length && position + i < result.length; i++) {
      const currentChar = result[position + i];
      const newChar = newText[i];
      
      if (this._pointDurability <= 0) {
        break;
      }

      if (currentChar === ' ') {
        // Writing in empty space
        result[position + i] = this.write(newChar);
      } else {
        // Writing over existing text causes collision
        result[position + i] = '@';
        this._pointDurability -= 1;
      }
    }

    return result.join('');
  }

  /**
   * Resets the pencil to its initial state
   */
  reset(): void {
    this._pointDurability = this._initialPointDurability;
    this._length = this._initialLength;
    this._eraserDurability = this._initialEraserDurability;
  }
}