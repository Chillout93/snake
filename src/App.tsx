import * as React from "react";
import * as _ from "lodash";
import { Apple, handleKeyPress, SnakePart, Direction, playGame } from "./code";
import { renderBoard } from "./components";

export type SetState = (state: Partial<AppState>) => void;
export type AppState = {
    snake: SnakePart[],
    apple: Apple,
    boardSize: number,
    gameOver: boolean,
    intervalId: NodeJS.Timeout,
    gameCounter: number,
    direction: Direction,
    score: number,
    highScore: number
}

export default class App extends React.Component<{}, AppState> {
    state: AppState = {
        apple: null,
        snake: [],
        boardSize: 20,
        score: 0,
        highScore: 10,
        gameOver: true,
        intervalId: null,
        direction: "Down",
        gameCounter: 1
    }

    componentDidMount() {
        // Start the Snake in the middle of the board and going down to start.
        //playAgain(this.state, this.setStateWrapper);
        document.addEventListener("keydown", (e) => handleKeyPress(e.key, this.state, this.setStateWrapper));
    }

    render() {
        const { boardSize, snake, gameOver, apple, score } = this.state;

        return <div className="container">
            <div className="mt-5"></div>
            <h1 className="mb-5">Snake</h1>
            {gameOver ? <h2>Game Over!</h2> : <h2>Playing...</h2>}
            <h3>Score: {score}</h3>
            <button className="btn btn-primary mb-2" onClick={this.playAgain}>Play Game</button>
            {renderBoard(boardSize, snake, apple)}
        </div>
    }

    setStateWrapper = (state: Partial<AppState>) => {
        const values = { ...state };
        this.setState({ ...this.state, ...values });
    }

    playAgain = () => {
        clearInterval(this.state.intervalId);

        const boardSize = 20;
        const snake: SnakePart[] = [{ x: boardSize / 2, y: boardSize / 2 }, { x: boardSize / 2, y: (boardSize / 2) - 1 }];
        const apple: Apple = { x: 5, y: 5 };

        const intervalId = setInterval(() => playGame(this.state, this.setStateWrapper), 1000);
        this.setState({ boardSize, snake, apple, intervalId, gameOver: false });
    }
}






