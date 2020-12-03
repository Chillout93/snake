import App, { AppState, SetState } from "./App";
import * as _ from "lodash";

// TYPES
export type Direction = "Up" | "Down" | "Left" | "Right";

export type SnakePart = {
    x: number,
    y: number
}

export type Poison = {
    x: number,
    y: number,
    direction: Direction
}

export type Apple = {
    x: number,
    y: number
}

export type BoardPart = {
    x: number,
    y: number
}

export type Square = "Snake" | "Apple" | "Empty" | "Poison";

// PUBLIC
export const playGame = (state: AppState, setState: SetState) => {
    let { snake, boardSize, gameCounter } = state;

    if (isGameOver(snake, boardSize - 1)) {
        clearInterval(state.intervalId);
        setState({ intervalId: null, gameOver: true, gameCounter: 1 });
    }

    if (gameCounter % 20 === 0) {
        const newApple = moveApple(state);
        setState({ apple: newApple });
    }

    if (gameCounter % 5 === 0) {
        const newSnake = moveSnake(state);
        setState({ snake: newSnake });
    }

    const poison = state.poison && movePoison(state);
    setState({ gameCounter: gameCounter + 1, poison });
}

// Update snake direction, prevent it from travelling backwards.
export const handleKeyPress = (key: React.Key, state: AppState, setState: SetState) => {
    console.log("KEY: ", key);
    if (key === "ArrowLeft" && state.direction !== "Right") setState({ direction: "Left" });
    else if (key === "ArrowUp" && state.direction !== "Down") setState({ direction: "Up" });
    else if (key === "ArrowRight" && state.direction !== "Left") setState({ direction: "Right" });
    else if (key === "ArrowDown" && state.direction !== "Up") setState({ direction: "Down" });

    if (key === "s" && state.poison === null) setState({ poison: { x: state.snake[0].x, y: state.snake[0].y, direction: state.direction } });
}

// PRIVATE

// If we have just ate an apple keep the current size (+1 from appending head) and place a new apple in a spot where the snake body is not, 
// otherwise we want to pop the tail as we have appened an item to the head to avoid increasing length.
const moveSnake = (state: AppState): SnakePart[] => {
    const { snake, direction, apple, boardSize, poison } = state;

    let snakeHead = { ...snake[0] };
    moveBoardPart(snakeHead, direction);

    const newSnake = [snakeHead, ...snake];
    if (snakeHead.x === apple.x && snakeHead.y === apple.y || (poison && poison.x === apple.x && poison.y === apple.y)) {
        const potentialApples = _.flatten(_.range(1, boardSize).map(y => _.range(1, boardSize).map(x => { return { x: x, y: y } }))).filter(x => !newSnake.some(y => y.y === x.y && y.x === x.x));
        const newApple = potentialApples[Math.floor(Math.random() * (potentialApples.length - 1))];
        apple.x = newApple.x;
        apple.y = newApple.y;
        state.score += 10;
    } else {
        newSnake.pop();
    }

    return newSnake;
}

const moveApple = (state: AppState) => {
    const random = Math.floor(Math.random() * 4);
    const direction = (["Up", "Down", "Left", "Right"] as Direction[])[random];
    const apple = state.apple;
    moveBoardPart(apple, direction);

    return apple;
}

const movePoison = (state: AppState) => {
    const { poison, boardSize } = state;

    if (poison.x > boardSize || poison.x <= 0 || poison.y > boardSize || poison.y <= 0) {
        state.poison = null;
        return null;
    };

    moveBoardPart(poison, poison.direction);
    return poison;
}


const moveBoardPart = (boardPart: BoardPart, direction: Direction) => {
    if (direction === "Left") boardPart.x -= 1;
    else if (direction === "Up") boardPart.y -= 1;
    else if (direction === "Down") boardPart.y += 1;
    else if (direction === "Right") boardPart.x += 1;
}

// If new snakeHead location is going to exit grid or touch another part of the snake, it's game over.
const isGameOver = (snake: SnakePart[], boardSize: number) => {
    const snakeHead = snake[0];
    if (snakeHead.x > boardSize || snakeHead.x <= 0 || snakeHead.y > boardSize || snakeHead.y <= 0) return true;
    if (snake.filter(s1 => s1.x === snakeHead.x && s1.y === snakeHead.y).length > 1) return true;

    return false;
}
