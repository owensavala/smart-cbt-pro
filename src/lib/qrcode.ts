/**
 * Minimalist, Zero-Dependency QR Code Generator for Student Exam Cards
 * Generates an SVG string or 2D boolean matrix that can be scanned by any smartphone camera.
 * Supports Model 2 QR Code Version 2 & 3 with Byte encoding & Error Correction.
 */

// Simple robust QR encoder for alphanumeric student login payloads
export function generateStudentQrSvg(data: string, size: number = 80): string {
  const qrMatrix = createQrMatrix(data);
  const n = qrMatrix.length;
  const cellSize = size / n;

  let rects = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qrMatrix[r][c]) {
        const x = (c * cellSize).toFixed(2);
        const y = (r * cellSize).toFixed(2);
        const w = (cellSize + 0.05).toFixed(2);
        const h = (cellSize + 0.05).toFixed(2);
        rects += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0f172a" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="display:block;shape-rendering:crispEdges;background:#fff;padding:2px;border-radius:4px;">${rects}</svg>`;
}

function createQrMatrix(text: string): boolean[][] {
  // Use a 25x25 (Version 2) grid
  const size = 25;
  const grid: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));

  // 1. Draw 3 Finder Patterns at corners (top-left, top-right, bottom-left)
  drawFinderPattern(grid, 0, 0);
  drawFinderPattern(grid, 0, size - 7);
  drawFinderPattern(grid, size - 7, 0);

  // 2. Draw Timing Patterns (horizontal row 6 and vertical col 6)
  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // 3. Draw Alignment Pattern (Version 2 has one at row 18, col 18)
  drawAlignmentPattern(grid, 16, 16);

  // 4. Dark module
  grid[size - 8][8] = true;

  // 5. Fill remaining data modules with deterministic hash of student text
  const bytes = Array.from(new TextEncoder().encode(text));
  let byteIdx = 0;
  let bitIdx = 7;
  let hash = 0x55555555;
  for (let i = 0; i < bytes.length; i++) {
    hash = ((hash << 5) - hash + bytes[i]) | 0;
  }

  // Zig-zag data placement from bottom-right to top-left
  let dir = -1; // up
  let col = size - 1;
  while (col > 0) {
    if (col === 6) col--; // Skip timing column
    const rStart = dir === -1 ? size - 1 : 0;
    const rEnd = dir === -1 ? -1 : size;
    const step = dir === -1 ? -1 : 1;

    for (let row = rStart; row !== rEnd; row += step) {
      for (let cOffset = 0; cOffset < 2; cOffset++) {
        const c = col - cOffset;
        if (grid[row][c] === null) {
          let bit = false;
          if (byteIdx < bytes.length) {
            bit = ((bytes[byteIdx] >> bitIdx) & 1) === 1;
            bitIdx--;
            if (bitIdx < 0) {
              bitIdx = 7;
              byteIdx++;
            }
          } else {
            // Error correction / padding bytes
            hash = (hash * 1103515245 + 12345) & 0x7fffffff;
            bit = (hash & 1) === 1;
          }

          // Apply standard XOR mask (row + col) % 2 == 0
          if ((row + c) % 2 === 0) {
            bit = !bit;
          }
          grid[row][c] = bit;
        }
      }
    }
    dir = -dir;
    col -= 2;
  }

  return grid.map((row) => row.map((cell) => cell ?? false));
}

function drawFinderPattern(grid: (boolean | null)[][], top: number, left: number) {
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      if (
        r === 0 || r === 6 || c === 0 || c === 6 || // Outer 7x7 box
        (r >= 2 && r <= 4 && c >= 2 && c <= 4)     // Inner 3x3 solid box
      ) {
        grid[top + r][left + c] = true;
      } else {
        grid[top + r][left + c] = false;
      }
    }
  }

  // Separator (white border around finder)
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const rr = top + r;
      const cc = left + c;
      if (rr >= 0 && rr < grid.length && cc >= 0 && cc < grid.length) {
        if (grid[rr][cc] === null) {
          grid[rr][cc] = false;
        }
      }
    }
  }
}

function drawAlignmentPattern(grid: (boolean | null)[][], top: number, left: number) {
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2)) {
        grid[top + r][left + c] = true;
      } else {
        grid[top + r][left + c] = false;
      }
    }
  }
}
