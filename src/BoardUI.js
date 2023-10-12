import { useState } from 'react';
import { GameState } from './gameState';
export default function BoardUI() {
    let [gameState, setGameState] = useState(new GameState(null));

    const currBoard = gameState.board;
    const rows = currBoard.map((row, i) => 
        <div key = {i}>
            {row.map((tile, j) => 
                <TileUI i={i} j = {j}/>
            )}
        </div>
    );

    return (
        <>{rows}</>
      );
}

function TileUI({i , j}) {
    return (
        <button className="tile">
          [{i},{j}]
        </button>
      );
}