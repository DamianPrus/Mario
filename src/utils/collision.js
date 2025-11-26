export function checkCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

export function checkGroundCollision(obj, blocks) {
  let onGround = false;

  blocks.forEach(block => {
    if (checkCollision(obj, block)) {
      // Check if object is landing on top of block
      if (obj.velocityY >= 0 && obj.y + obj.height <= block.y + 10) {
        obj.y = block.y - obj.height;
        obj.velocityY = 0;
        onGround = true;
      }
    }
  });

  return onGround;
}

export function checkBlockCollision(obj, blocks) {
  const collisions = [];

  blocks.forEach(block => {
    if (checkCollision(obj, block)) {
      collisions.push(block);
    }
  });

  return collisions;
}

export function resolveCollision(obj, block) {
  const overlapLeft = obj.x + obj.width - block.x;
  const overlapRight = block.x + block.width - obj.x;
  const overlapTop = obj.y + obj.height - block.y;
  const overlapBottom = block.y + block.height - obj.y;

  const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

  if (minOverlap === overlapTop && obj.velocityY > 0) {
    obj.y = block.y - obj.height;
    obj.velocityY = 0;
    return 'top';
  } else if (minOverlap === overlapBottom && obj.velocityY < 0) {
    obj.y = block.y + block.height;
    obj.velocityY = 0;
    return 'bottom';
  } else if (minOverlap === overlapLeft) {
    obj.x = block.x - obj.width;
    obj.velocityX = 0;
    return 'left';
  } else if (minOverlap === overlapRight) {
    obj.x = block.x + block.width;
    obj.velocityX = 0;
    return 'right';
  }

  return null;
}
