// constants
const W = 16;
const H = 16;
const SNAKE_COLOR = "#E8DDB5";
const APPLE_COLOR = "#EDAFB8";

// elem
const id = document.getElementById.bind(document);
const canvas = id("snake");
const scoreText = id("score");
const ctx = canvas.getContext("2d");

// state
const snake = [[Math.floor(W / 2), Math.floor(H / 2)]];
const apples = [];

let score = 0;
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
  }

  const keyMap = {
    w: [0, -1],
    s: [0, 1],
    a: [-1, 0],
    d: [1, 0],
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
  const mx = canvas.width / W;
  const my = canvas.height / H;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = SNAKE_COLOR;
  snake.forEach(([x, y]) => {
    ctx.fillRect(x * mx, y * my, mx, my);
  });
  ctx.fillStyle = APPLE_COLOR;
  apples.forEach(([x, y]) => {
    ctx.fillRect(x * mx, y * my, mx, my);
  });

  scoreText.innerText = score;
}

function vecSum(v1, v2) {
  return v1.map((val, i) => val + v2[i]);
}

function vecEquals(v1, v2) {
  return v1.every((val, i) => val === v2[i]);
}
