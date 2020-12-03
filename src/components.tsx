import * as React from "react";
import { Apple, Poison, SnakePart, Square } from "./code";
import * as _ from "lodash";

export const renderBoard = (boardSize: number, snake: SnakePart[], apple: Apple, poison: Poison) => {
    const board: Square[][] = _.range(1, boardSize).map(y => _.range(1, boardSize).map(x => {
        const isSnakeSquare = snake.find(s => s.x === x && s.y === y);
        const isApple = apple && apple.x === x && apple.y === y;
        const isPoison = poison && poison.x === x && poison.y === y;
        return isSnakeSquare
            ? "Snake"
            : isPoison
                ? "Poison"
                : isApple
                    ? "Apple"
                    : "Empty";
    }));

    return <table className="table-bordered">
        <tbody>
            {board.map((y, i) => <tr key={i}>
                {y.map(x => renderSquare(x))}
            </tr>)}
        </tbody>
    </table>
}

const renderSquare = (square: Square) => {
    switch (square) {
        case "Apple": return <td style={{ backgroundColor: "red", width: 30, height: 30 }}></td>;
        case "Snake": return <td style={{ backgroundColor: "darkgreen", width: 30, height: 30 }}></td>;
        case "Empty": return <td style={{ width: 30, height: 30 }}></td>;
        case "Poison": return <td style={{ width: 30, height: 30, backgroundColor: "purple" }}></td>
    }
}