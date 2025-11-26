// World 1-1 Level Data
// Grid: 16x16 pixels per tile
// Level dimensions: 212 tiles wide x 15 tiles high

export const TILE_SIZE = 32;
export const LEVEL_WIDTH = 212 * TILE_SIZE;
export const LEVEL_HEIGHT = 15 * TILE_SIZE;

// Block types
export const BLOCK_TYPES = {
  GROUND: 'ground',
  BRICK: 'brick',
  QUESTION: 'question',
  USED_QUESTION: 'used_question',
  PIPE_TOP_LEFT: 'pipe_tl',
  PIPE_TOP_RIGHT: 'pipe_tr',
  PIPE_LEFT: 'pipe_l',
  PIPE_RIGHT: 'pipe_r',
  CLOUD: 'cloud',
  BUSH: 'bush',
  HILL: 'hill',
  CASTLE: 'castle',
  FLAG_POLE: 'flag_pole',
  FLAG: 'flag'
};

// Level 1-1 map data
export const level1_1 = {
  // Ground blocks (y = 13-14, full level)
  ground: [
    // Start area ground
    { x: 0, y: 13, width: 69, height: 2 },
    // After first gap
    { x: 71, y: 13, width: 14, height: 2 },
    // After second gap
    { x: 86, y: 13, width: 63, height: 2 },
    // After third gap (stairs area)
    { x: 153, y: 13, width: 59, height: 2 },
  ],

  // Brick blocks
  bricks: [
    // First brick group
    { x: 16, y: 9, width: 1, height: 1 },
    { x: 20, y: 9, width: 1, height: 1 },
    { x: 21, y: 9, width: 1, height: 1 },
    { x: 22, y: 9, width: 1, height: 1 },
    { x: 23, y: 9, width: 1, height: 1 },
    { x: 24, y: 9, width: 1, height: 1 },

    { x: 77, y: 9, width: 1, height: 1 },
    { x: 78, y: 9, width: 1, height: 1 },

    { x: 80, y: 5, width: 8, height: 1 },

    { x: 91, y: 9, width: 1, height: 1 },
    { x: 94, y: 9, width: 1, height: 1 },

    { x: 100, y: 5, width: 3, height: 1 },

    { x: 107, y: 9, width: 1, height: 1 },
    { x: 109, y: 9, width: 2, height: 1 },

    { x: 118, y: 9, width: 1, height: 1 },

    { x: 121, y: 5, width: 3, height: 1 },

    { x: 128, y: 5, width: 1, height: 1 },
    { x: 129, y: 9, width: 2, height: 1 },
    { x: 131, y: 5, width: 1, height: 1 },

    { x: 168, y: 9, width: 1, height: 1 },
    { x: 169, y: 9, width: 1, height: 1 },
    { x: 171, y: 9, width: 1, height: 1 },
  ],

  // Question blocks (with contents)
  questions: [
    { x: 16, y: 9, type: 'coin' },
    { x: 21, y: 5, type: 'mushroom' },
    { x: 22, y: 9, type: 'coin' },
    { x: 78, y: 9, type: 'coin' },
    { x: 94, y: 9, type: 'coin' },
    { x: 106, y: 9, type: 'mushroom' },
    { x: 109, y: 9, type: 'coin' },
    { x: 109, y: 5, type: 'coin' },
    { x: 110, y: 9, type: 'coin' },
    { x: 129, y: 9, type: 'coin' },
    { x: 130, y: 9, type: 'coin' },
  ],

  // Pipes
  pipes: [
    { x: 28, y: 11, height: 2 },
    { x: 38, y: 10, height: 3 },
    { x: 46, y: 9, height: 4 },
    { x: 57, y: 9, height: 4 },
    { x: 163, y: 11, height: 2 },
    { x: 179, y: 11, height: 2 },
  ],

  // Stairs
  stairs: [
    { x: 134, y: 12, direction: 'up' },
    { x: 140, y: 12, direction: 'down' },
    { x: 148, y: 12, direction: 'up' },
    { x: 155, y: 12, direction: 'down' },
  ],

  // Flag pole
  flag: {
    x: 198,
    y: 3,
    height: 10
  },

  // Enemies
  enemies: [
    { type: 'goomba', x: 22, y: 12 },
    { type: 'goomba', x: 40, y: 12 },
    { type: 'goomba', x: 51, y: 12 },
    { type: 'goomba', x: 52, y: 12 },
    { type: 'goomba', x: 80, y: 12 },
    { type: 'goomba', x: 81, y: 12 },
    { type: 'koopa', x: 97, y: 12 },
    { type: 'goomba', x: 114, y: 12 },
    { type: 'goomba', x: 115, y: 12 },
    { type: 'koopa', x: 123, y: 12 },
    { type: 'goomba', x: 126, y: 12 },
    { type: 'goomba', x: 127, y: 12 },
    { type: 'goomba', x: 174, y: 12 },
    { type: 'goomba', x: 175, y: 12 },
  ],

  // Floating platforms
  platforms: [
    { x: 134, y: 12, width: 1, height: 1 },
    { x: 135, y: 11, width: 1, height: 1 },
    { x: 136, y: 10, width: 1, height: 1 },
    { x: 137, y: 9, width: 1, height: 1 },
    { x: 138, y: 9, width: 1, height: 1 },
    { x: 139, y: 10, width: 1, height: 1 },
    { x: 140, y: 11, width: 1, height: 1 },
    { x: 141, y: 12, width: 1, height: 1 },

    { x: 148, y: 12, width: 1, height: 1 },
    { x: 149, y: 11, width: 1, height: 1 },
    { x: 150, y: 10, width: 1, height: 1 },
    { x: 151, y: 9, width: 1, height: 1 },
    { x: 152, y: 10, width: 1, height: 1 },
    { x: 153, y: 11, width: 1, height: 1 },
    { x: 154, y: 12, width: 1, height: 1 },
  ],

  // Hidden blocks
  hiddenBlocks: [
    { x: 64, y: 9 },
    { x: 77, y: 5 },
    { x: 109, y: 5 },
  ]
};
