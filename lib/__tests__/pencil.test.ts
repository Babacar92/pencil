import { Pencil } from '../pencil';

describe('Pencil', () => {
  let pencil: Pencil;

  beforeEach(() => {
    pencil = new Pencil(100, 10, 50);
  });

  describe('Construction', () => {
    test('should create a pencil with default values', () => {
      const defaultPencil = new Pencil();
      expect(defaultPencil.pointDurability).toBe(100);
      expect(defaultPencil.length).toBe(10);
      expect(defaultPencil.eraserDurability).toBe(50);
    });

    test('should create a pencil with custom values', () => {
      const customPencil = new Pencil(200, 15, 75);
      expect(customPencil.pointDurability).toBe(200);
      expect(customPencil.length).toBe(15);
      expect(customPencil.eraserDurability).toBe(75);
    });
  });

  describe('Writing', () => {
    test('should write text without degradation for spaces', () => {
      const result = pencil.write('   ');
      expect(result).toBe('   ');
      expect(pencil.pointDurability).toBe(100);
    });

    test('should degrade by 1 for lowercase letters', () => {
      const result = pencil.write('hello');
      expect(result).toBe('hello');
      expect(pencil.pointDurability).toBe(95);
    });

    test('should degrade by 2 for uppercase letters', () => {
      const result = pencil.write('HELLO');
      expect(result).toBe('HELLO');
      expect(pencil.pointDurability).toBe(90);
    });

    test('should handle mixed case text', () => {
      const result = pencil.write('Hello World');
      expect(result).toBe('Hello World');
      expect(pencil.pointDurability).toBe(87); // H(2) + e(1) + l(1) + l(1) + o(1) + W(2) + o(1) + r(1) + l(1) + d(1) = 13
    });

    test('should write spaces when point is dull', () => {
      const dullPencil = new Pencil(0);
      const result = dullPencil.write('hello');
      expect(result).toBe('     ');
    });

    test('should partially write when durability runs out', () => {
      const lowDurabilityPencil = new Pencil(3);
      const result = lowDurabilityPencil.write('hello');
      expect(result).toBe('hel  ');
      expect(lowDurabilityPencil.pointDurability).toBe(0);
    });

    test('should not degrade for special characters', () => {
      const result = pencil.write('!@#$%');
      expect(result).toBe('!@#$%');
      expect(pencil.pointDurability).toBe(100);
    });
  });

  describe('Sharpening', () => {
    test('should restore point durability and reduce length', () => {
      pencil.write('hello'); // Reduces durability to 95
      const success = pencil.sharpen();
      
      expect(success).toBe(true);
      expect(pencil.pointDurability).toBe(100);
      expect(pencil.length).toBe(9);
    });

    test('should not sharpen when length is 0', () => {
      const shortPencil = new Pencil(50, 0);
      const success = shortPencil.sharpen();
      
      expect(success).toBe(false);
      expect(shortPencil.pointDurability).toBe(50);
      expect(shortPencil.length).toBe(0);
    });

    test('should not sharpen when already sharp', () => {
      const success = pencil.sharpen();
      
      expect(success).toBe(false);
      expect(pencil.pointDurability).toBe(100);
      expect(pencil.length).toBe(10);
    });
  });

  describe('Erasing', () => {
    test('should erase text from the end', () => {
      const text = 'Hello World';
      const result = pencil.erase(text, 'World');
      expect(result).toBe('Hello      ');
      expect(pencil.eraserDurability).toBe(45);
    });

    test('should erase the last occurrence of text', () => {
      const text = 'Hello World Hello';
      const result = pencil.erase(text, 'Hello');
      expect(result).toBe('Hello World      ');
    });

    test('should partially erase when eraser durability is low', () => {
      const lowEraserPencil = new Pencil(100, 10, 3);
      const text = 'Hello World';
      const result = lowEraserPencil.erase(text, 'World');
      expect(result).toBe('Hello   rld');
      expect(lowEraserPencil.eraserDurability).toBe(0);
    });

    test('should not erase when eraser is worn out', () => {
      const noEraserPencil = new Pencil(100, 10, 0);
      const text = 'Hello World';
      const result = noEraserPencil.erase(text, 'World');
      expect(result).toBe('Hello World');
    });

    test('should not erase non-existent text', () => {
      const text = 'Hello World';
      const result = pencil.erase(text, 'xyz');
      expect(result).toBe('Hello World');
      expect(pencil.eraserDurability).toBe(50);
    });
  });

  describe('Editing', () => {
    test('should write in erased spaces', () => {
      const text = 'Hello      ';
      const result = pencil.edit(text, 'World', 6);
      expect(result).toBe('Hello World');
    });

    test('should create collisions when writing over existing text', () => {
      const text = 'Hello World';
      const result = pencil.edit(text, 'Earth', 6);
      expect(result).toBe('Hello @@@@@');
    });

    test('should not edit when point is dull', () => {
      const dullPencil = new Pencil(0);
      const text = 'Hello      ';
      const result = dullPencil.edit(text, 'World', 6);
      expect(result).toBe('Hello      ');
    });

    test('should stop editing when durability runs out', () => {
      const lowDurabilityPencil = new Pencil(3);
      const text = 'Hello World';
      const result = lowDurabilityPencil.edit(text, 'Earth', 6);
      expect(result).toBe('Hello @@@ld');
      expect(lowDurabilityPencil.pointDurability).toBe(0);
    });
  });

  describe('State Properties', () => {
    test('should report sharp status correctly', () => {
      expect(pencil.isSharp).toBe(true);
      
      const dullPencil = new Pencil(0);
      expect(dullPencil.isSharp).toBe(false);
    });

    test('should report erase capability correctly', () => {
      expect(pencil.canErase).toBe(true);
      
      const noEraserPencil = new Pencil(100, 10, 0);
      expect(noEraserPencil.canErase).toBe(false);
    });

    test('should report sharpen capability correctly', () => {
      pencil.write('hello'); // Make it dull
      expect(pencil.canSharpen).toBe(true);
      
      const shortPencil = new Pencil(100, 0);
      expect(shortPencil.canSharpen).toBe(false);
    });
  });

  describe('Reset', () => {
    test('should reset pencil to initial state', () => {
      pencil.write('hello');
      pencil.erase('hello', 'he');
      pencil.sharpen();
      
      pencil.reset();
      
      expect(pencil.pointDurability).toBe(100);
      expect(pencil.length).toBe(10);
      expect(pencil.eraserDurability).toBe(50);
    });
  });
});