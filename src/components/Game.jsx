import React, { useEffect, useRef, useState } from 'react';
import { level1_1, TILE_SIZE, LEVEL_WIDTH, LEVEL_HEIGHT } from '../data/level1-1';
import { Mario } from '../utils/Mario';
import { Enemy } from '../utils/Enemy';
import { PowerUp } from '../utils/PowerUp';
import { checkCollision, checkGroundCollision, checkBlockCollision } from '../utils/collision';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 480;
const GRAVITY = 0.5;
const MAX_FALL_SPEED = 10;

function Game() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(400);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  const gameStateRef = useRef({
    mario: null,
    enemies: [],
    powerUps: [],
    blocks: [],
    camera: { x: 0, y: 0 },
    keys: {},
    animationFrame: 0,
    usedBlocks: new Set(),
    hiddenBlocksRevealed: new Set()
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let lastTime = performance.now();

    // Initialize game
    const initGame = () => {
      // Create Mario
      gameStateRef.current.mario = new Mario(100, LEVEL_HEIGHT - 3 * TILE_SIZE - 64);

      // Create blocks from level data
      const blocks = [];

      // Ground blocks
      level1_1.ground.forEach(ground => {
        for (let i = 0; i < ground.width; i++) {
          for (let j = 0; j < ground.height; j++) {
            blocks.push({
              x: (ground.x + i) * TILE_SIZE,
              y: (ground.y + j) * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
              type: 'ground'
            });
          }
        }
      });

      // Brick blocks
      level1_1.bricks.forEach(brick => {
        for (let i = 0; i < brick.width; i++) {
          for (let j = 0; j < brick.height; j++) {
            blocks.push({
              x: (brick.x + i) * TILE_SIZE,
              y: (brick.y + j) * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
              type: 'brick',
              breakable: true
            });
          }
        }
      });

      // Question blocks
      level1_1.questions.forEach(question => {
        blocks.push({
          x: question.x * TILE_SIZE,
          y: question.y * TILE_SIZE,
          width: TILE_SIZE,
          height: TILE_SIZE,
          type: 'question',
          content: question.type,
          used: false
        });
      });

      // Pipes
      level1_1.pipes.forEach(pipe => {
        for (let i = 0; i < pipe.height; i++) {
          blocks.push({
            x: pipe.x * TILE_SIZE,
            y: (13 - pipe.height + i) * TILE_SIZE,
            width: TILE_SIZE * 2,
            height: TILE_SIZE,
            type: i === 0 ? 'pipe_top' : 'pipe_body'
          });
        }
      });

      // Platforms (stairs)
      level1_1.platforms.forEach(platform => {
        blocks.push({
          x: platform.x * TILE_SIZE,
          y: platform.y * TILE_SIZE,
          width: TILE_SIZE,
          height: TILE_SIZE,
          type: 'brick'
        });
      });

      // Flag pole
      blocks.push({
        x: level1_1.flag.x * TILE_SIZE,
        y: level1_1.flag.y * TILE_SIZE,
        width: TILE_SIZE,
        height: level1_1.flag.height * TILE_SIZE,
        type: 'flag_pole'
      });

      gameStateRef.current.blocks = blocks;

      // Create enemies
      const enemies = level1_1.enemies.map(enemy =>
        new Enemy(
          enemy.x * TILE_SIZE,
          enemy.y * TILE_SIZE,
          enemy.type
        )
      );
      gameStateRef.current.enemies = enemies;
    };

    // Input handling
    const handleKeyDown = (e) => {
      gameStateRef.current.keys[e.key] = true;
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      gameStateRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game loop
    const gameLoop = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 16.67; // Normalize to 60fps
      lastTime = currentTime;

      const state = gameStateRef.current;
      const mario = state.mario;

      if (!mario || gameOver || victory) {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      // Update Mario
      const keys = state.keys;

      // Horizontal movement
      if (keys['ArrowLeft']) {
        mario.moveLeft();
      } else if (keys['ArrowRight']) {
        mario.moveRight();
      } else {
        mario.decelerate();
      }

      // Jumping
      if ((keys[' '] || keys['ArrowUp']) && mario.onGround) {
        mario.jump();
      }

      // Apply gravity
      if (!mario.onGround) {
        mario.velocityY += GRAVITY;
        if (mario.velocityY > MAX_FALL_SPEED) {
          mario.velocityY = MAX_FALL_SPEED;
        }
      }

      // Update position
      mario.x += mario.velocityX;
      mario.y += mario.velocityY;

      // Keep Mario in bounds
      if (mario.x < 0) mario.x = 0;
      if (mario.x > LEVEL_WIDTH - mario.width) mario.x = LEVEL_WIDTH - mario.width;

      // Check ground collision
      mario.onGround = false;
      state.blocks.forEach(block => {
        if (checkCollision(mario, block)) {
          // Top collision (Mario lands on block)
          if (mario.velocityY > 0 && mario.y + mario.height - mario.velocityY <= block.y) {
            mario.y = block.y - mario.height;
            mario.velocityY = 0;
            mario.onGround = true;
          }
          // Bottom collision (Mario hits block from below)
          else if (mario.velocityY < 0 && mario.y - mario.velocityY >= block.y + block.height) {
            mario.y = block.y + block.height;
            mario.velocityY = 0;

            // Handle block interactions
            if (block.type === 'brick' && block.breakable && mario.big) {
              // Break brick
              block.broken = true;
              setScore(s => s + 50);
            } else if (block.type === 'question' && !block.used) {
              // Hit question block
              block.used = true;
              block.type = 'used_question';

              if (block.content === 'coin') {
                setCoins(c => c + 1);
                setScore(s => s + 200);
              } else if (block.content === 'mushroom') {
                const powerUp = new PowerUp(block.x, block.y - TILE_SIZE, 'mushroom');
                state.powerUps.push(powerUp);
              }
            }
          }
          // Side collision
          else {
            if (mario.velocityX > 0) {
              mario.x = block.x - mario.width;
            } else if (mario.velocityX < 0) {
              mario.x = block.x + block.width;
            }
            mario.velocityX = 0;
          }
        }
      });

      // Remove broken blocks
      state.blocks = state.blocks.filter(b => !b.broken);

      // Update enemies
      state.enemies.forEach((enemy, index) => {
        if (enemy.dead) return;

        enemy.update();

        // Enemy gravity
        enemy.velocityY += GRAVITY;
        enemy.y += enemy.velocityY;

        // Enemy ground collision
        enemy.onGround = false;
        state.blocks.forEach(block => {
          if (checkCollision(enemy, block)) {
            if (enemy.velocityY > 0 && enemy.y + enemy.height - enemy.velocityY <= block.y) {
              enemy.y = block.y - enemy.height;
              enemy.velocityY = 0;
              enemy.onGround = true;
            } else {
              // Enemy hits wall, turn around
              enemy.velocityX *= -1;
            }
          }
        });

        // Check collision with Mario
        if (checkCollision(mario, enemy)) {
          if (mario.velocityY > 0 && mario.y + mario.height / 2 < enemy.y) {
            // Mario jumps on enemy
            enemy.dead = true;
            mario.velocityY = -8;
            setScore(s => s + 100);
          } else {
            // Mario hits enemy
            if (mario.big) {
              mario.big = false;
              mario.height = 32;
            } else {
              setLives(l => l - 1);
              if (lives <= 1) {
                setGameOver(true);
              } else {
                // Reset Mario position
                mario.x = 100;
                mario.y = LEVEL_HEIGHT - 3 * TILE_SIZE - 64;
              }
            }
          }
        }
      });

      // Update power-ups
      state.powerUps.forEach((powerUp, index) => {
        powerUp.update();
        powerUp.velocityY += GRAVITY;
        powerUp.y += powerUp.velocityY;

        // Power-up ground collision
        state.blocks.forEach(block => {
          if (checkCollision(powerUp, block)) {
            if (powerUp.velocityY > 0) {
              powerUp.y = block.y - powerUp.height;
              powerUp.velocityY = 0;
            } else {
              powerUp.velocityX *= -1;
            }
          }
        });

        // Check collision with Mario
        if (checkCollision(mario, powerUp)) {
          if (powerUp.type === 'mushroom' && !mario.big) {
            mario.big = true;
            mario.height = 64;
            setScore(s => s + 1000);
          }
          state.powerUps.splice(index, 1);
        }
      });

      // Check victory (reached flag)
      const flagBlock = state.blocks.find(b => b.type === 'flag_pole');
      if (flagBlock && mario.x >= flagBlock.x) {
        setVictory(true);
      }

      // Death by falling
      if (mario.y > LEVEL_HEIGHT) {
        setLives(l => l - 1);
        if (lives <= 1) {
          setGameOver(true);
        } else {
          mario.x = 100;
          mario.y = LEVEL_HEIGHT - 3 * TILE_SIZE - 64;
          mario.velocityY = 0;
        }
      }

      // Update camera
      state.camera.x = Math.max(0, Math.min(mario.x - CANVAS_WIDTH / 3, LEVEL_WIDTH - CANVAS_WIDTH));
      state.camera.y = 0;

      // Render
      render(ctx, state);

      // Update animation frame
      state.animationFrame++;

      animationId = requestAnimationFrame(gameLoop);
    };

    // Render function
    const render = (ctx, state) => {
      // Clear canvas
      ctx.fillStyle = '#5c94fc';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const camera = state.camera;

      // Draw clouds (background)
      ctx.fillStyle = '#ffffff';
      const clouds = [
        { x: 100, y: 100 },
        { x: 450, y: 80 },
        { x: 800, y: 100 },
        { x: 1200, y: 120 },
        { x: 1600, y: 90 },
        { x: 2000, y: 110 },
      ];

      clouds.forEach(cloud => {
        const x = cloud.x - camera.x;
        const y = cloud.y;
        if (x > -100 && x < CANVAS_WIDTH + 100) {
          ctx.beginPath();
          ctx.arc(x, y, 20, 0, Math.PI * 2);
          ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
          ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw blocks
      state.blocks.forEach(block => {
        const x = block.x - camera.x;
        const y = block.y;

        if (x < -TILE_SIZE || x > CANVAS_WIDTH + TILE_SIZE) return;

        if (block.type === 'ground') {
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(x, y, block.width, block.height);
          ctx.strokeStyle = '#654321';
          ctx.strokeRect(x, y, block.width, block.height);
        } else if (block.type === 'brick') {
          ctx.fillStyle = '#D2691E';
          ctx.fillRect(x, y, block.width, block.height);
          ctx.strokeStyle = '#8B4513';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, block.width, block.height);
          ctx.strokeRect(x + 4, y + 4, block.width - 8, block.height - 8);
        } else if (block.type === 'question') {
          const anim = Math.floor(state.animationFrame / 10) % 2;
          ctx.fillStyle = anim ? '#FFD700' : '#FFA500';
          ctx.fillRect(x, y, block.width, block.height);
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, block.width, block.height);
          ctx.fillStyle = '#000';
          ctx.font = 'bold 24px Arial';
          ctx.fillText('?', x + 8, y + 26);
        } else if (block.type === 'used_question') {
          ctx.fillStyle = '#8B7355';
          ctx.fillRect(x, y, block.width, block.height);
          ctx.strokeStyle = '#654321';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, block.width, block.height);
        } else if (block.type === 'pipe_top') {
          ctx.fillStyle = '#00FF00';
          ctx.fillRect(x, y, block.width, block.height);
          ctx.strokeStyle = '#008000';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, block.width, block.height);
          ctx.fillRect(x + 5, y + 5, block.width - 10, block.height / 2);
        } else if (block.type === 'pipe_body') {
          ctx.fillStyle = '#00CC00';
          ctx.fillRect(x, y, block.width, block.height);
          ctx.strokeStyle = '#008000';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, block.width, block.height);
        } else if (block.type === 'flag_pole') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x + 14, y, 4, block.height);
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(x + 18, y + 10, 30, 20);
        }
      });

      // Draw enemies
      state.enemies.forEach(enemy => {
        if (enemy.dead) return;
        const x = enemy.x - camera.x;
        const y = enemy.y;

        if (x < -50 || x > CANVAS_WIDTH + 50) return;

        if (enemy.type === 'goomba') {
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(x, y, enemy.width, enemy.height);
          ctx.fillStyle = '#000';
          ctx.fillRect(x + 5, y + 5, 8, 8);
          ctx.fillRect(x + enemy.width - 13, y + 5, 8, 8);
        } else if (enemy.type === 'koopa') {
          ctx.fillStyle = '#00FF00';
          ctx.fillRect(x, y, enemy.width, enemy.height * 0.6);
          ctx.fillStyle = '#FFFF00';
          ctx.fillRect(x, y + enemy.height * 0.6, enemy.width, enemy.height * 0.4);
        }
      });

      // Draw power-ups
      state.powerUps.forEach(powerUp => {
        const x = powerUp.x - camera.x;
        const y = powerUp.y;

        if (x < -50 || x > CANVAS_WIDTH + 50) return;

        if (powerUp.type === 'mushroom') {
          ctx.fillStyle = '#FF0000';
          ctx.beginPath();
          ctx.arc(x + powerUp.width / 2, y + powerUp.height / 3, powerUp.width / 2, 0, Math.PI, true);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x + powerUp.width / 3, y, 4, 8);
          ctx.fillStyle = '#FFE4B5';
          ctx.fillRect(x, y + powerUp.height / 3, powerUp.width, powerUp.height * 2 / 3);
        }
      });

      // Draw Mario
      const mario = state.mario;
      const marioX = mario.x - camera.x;
      const marioY = mario.y;

      if (mario.big) {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(marioX, marioY, mario.width, mario.height / 2);
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(marioX, marioY + mario.height / 2, mario.width, mario.height / 2);
      } else {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(marioX, marioY, mario.width, mario.height * 0.4);
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(marioX, marioY + mario.height * 0.4, mario.width, mario.height * 0.6);
      }

      // Draw face
      ctx.fillStyle = '#FFE4B5';
      ctx.fillRect(marioX + 8, marioY + 10, 16, 12);
      ctx.fillStyle = '#000';
      ctx.fillRect(marioX + 10, marioY + 14, 3, 3);
      ctx.fillRect(marioX + 19, marioY + 14, 3, 3);
    };

    initGame();
    animationId = requestAnimationFrame(gameLoop);

    // Timer
    const timerInterval = setInterval(() => {
      if (!gameOver && !victory) {
        setTime(t => {
          if (t <= 1) {
            setGameOver(true);
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(timerInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, victory]);

  return (
    <div className="game-container">
      <div className="hud">
        <div className="hud-item">MARIO</div>
        <div className="hud-item">SCORE: {score.toString().padStart(6, '0')}</div>
        <div className="hud-item">COINS: {coins.toString().padStart(2, '0')}</div>
        <div className="hud-item">WORLD: 1-1</div>
        <div className="hud-item">TIME: {time}</div>
        <div className="hud-item">LIVES: {lives}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      {gameOver && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold',
          textShadow: '2px 2px 0px #000'
        }}>
          GAME OVER
        </div>
      )}
      {victory && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold',
          textShadow: '2px 2px 0px #000'
        }}>
          VICTORY!
        </div>
      )}
    </div>
  );
}

export default Game;
