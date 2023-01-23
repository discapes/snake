// constants
const W = 16;
const H = 16;
const SNAKE_COLOR = "#E8DDB5";
const APPLE_COLOR = "#EDAFB8";
const DOWN = [0, 1];
const UP = [0, -1];
const LEFT = [-1, 0];
const RIGHT = [1, 0];

// elem
const id = document.getElementById.bind(document);
const canvas = id("snake");
const scoreText = id("score");
const ctx = canvas.getContext("2d");

// state
const snake = [[Math.floor(W / 2), Math.floor(H / 2)]];
const apples = [];

let score = 0;
let bot = false;
let over = false;

const dirQue = [];
let dir;

// effects

newApple();
newApple();
newApple();

draw();

let interval = setInterval(() => {
  if (over) {
    clearInterval(interval);
    return;
  }
  if (bot) botMove();
  const newDir = dirQue.shift();
  const valid = newDir && !(dir && vecEquals(vecSum(newDir, dir), [0, 0]));
  if (valid) dir = newDir;
  if (!dir) return;
  const head = vecSum(snake.at(-1), dir);
  moveTo(head);
  draw();
}, 100);

document.onkeydown = (e) => {
  if (e.key === " ") {
    alert("Game is paused.");
    return;
  } else if (e.key === "b") {
    bot = true;
  }

  const keyMap = {
    w: UP,
    s: DOWN,
    a: LEFT,
    d: RIGHT,
  };
  keyMap.ArrowUp = keyMap.w;
  keyMap.ArrowDown = keyMap.s;
  keyMap.ArrowLeft = keyMap.a;
  keyMap.ArrowRight = keyMap.d;

  const d = keyMap[e.key];
  if (!d) return;
  dirQue.push(d);
};

// functions

function moveTo(head) {
  const appleIndex = apples.findIndex(
    ([x, y]) => head[0] === x && head[1] === y
  );

  if (!emptySpace(head) && appleIndex == -1) {
    alert("Game over! - Score: " + score);
    over = true;
    location.reload();
  }

  snake.push(head);

  if (~appleIndex) {
    score++;
    apples.splice(appleIndex, 1);
    newApple();
  } else {
    snake.shift();
  }
}

function newApple() {
  let pos;
  do {
    pos = [Math.floor(Math.random() * W), Math.floor(Math.random() * H)];
  } while (!emptySpace(pos));
  apples.push(pos);
}

function botMove() {
  const [x, y] = snake.at(-1);
  if (x === 0 && y % 2 === 1) {
    // on the left side make a U-turn
    dirQue.push(UP);
    dirQue.push(RIGHT);
  } else if (x === W - 2 && y !== 0 && y % 2 === 0) {
    // on almost the right side make a U-turn, except at the top
    dirQue.push(UP);
    dirQue.push(LEFT);
  } else if (y === 0 && x === W - 1) {
    // at the top right turn down
    dirQue.push(DOWn);
  } else if (y === H - 1 && x === W - 1) {
    // at the bottom right turn left
    dirQue.push(LEFT);
  }
}

function emptySpace(pos) {
  const [x, y] = pos;
  return (
    x >= 0 &&
    x < W &&
    y >= 0 &&
    y < H &&
    !snake.find((v) => vecEquals(v, pos)) &&
    !apples.find((v) => vecEquals(v, pos))
  );
}

function draw() {
  const mx = canvas.width / W; // cell size
  const my = canvas.height / H;

  let eyeY = (1 / 5) * my;
  const eyeH = (1 / 5) * my;
  let eyeX = (1 / 5) * mx;
  const eyeW = (1 / 5) * mx;
  // if (dir && vecEquals(dir, )) eyeX = reverseOffset(mx, eyeX, eyeW);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = SNAKE_COLOR;
  snake.forEach(([x, y]) => {
    ctx.fillRect(x * mx, y * my, mx, my);
  });

  ctx.fillStyle = "#000000";
  ctx.fillRect(
    snake.at(-1)[0] * mx +
      (dir && vecEquals(dir, LEFT) ? eyeX : eyeX * 2 + eyeW),
    snake.at(-1)[1] * my + (dir && vecEquals(dir, UP) ? eyeY : eyeY * 2 + eyeH),
    eyeW,
    eyeH
  );
  ctx.fillRect(
    snake.at(-1)[0] * mx +
      (dir && vecEquals(dir, RIGHT) ? eyeX * 2 + eyeW : eyeX),
    snake.at(-1)[1] * my +
      (dir && vecEquals(dir, DOWN) ? eyeY * 2 + eyeH : eyeH),
    eyeW,
    eyeH
  );

  ctx.fillStyle = APPLE_COLOR;
  apples.forEach(([x, y]) => {
    ctx.fillRect(x * mx, y * my, mx, my);
  });
  scoreText.innerText = score;
}

function reverseOffset(containerW, offset, w) {
  return containerW - (offset + w);
}

function vecSum(v1, v2) {
  return v1.map((val, i) => val + v2[i]);
}

function vecEquals(v1, v2) {
  return v1.every((val, i) => val === v2[i]);
}
