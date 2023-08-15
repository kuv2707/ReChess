import { useEffect, useState } from "react";
import styles from "./ChessBoard.module.css";
import ChessBoardCell from "./ChessBoardCell";
function ChessBoard() {
	const cells = [];
	const [pieceMap, setPieceMap] = useState({} as BoardMap);
	const [selected, setSelected] = useState("");
	const [highlightedMoves, setHighlightedMoves] = useState([] as string[]);
	
	useEffect(()=>
	{
		fetch("http://localhost:3000/api/v1/games/dev/newgame",{
			method:"POST"
		}).then(k=>k.json()).then(({data})=>
		{
			console.log(data)

			localStorage.setItem("gameid",data.gameid)
			setPieceMap(()=>getMapFromFen(data.boardFEN))
		})
	},[])

	function fetchHighlightedMoves(loc:string)
	{
		return function():void
		{
			console.log("fetching for"+loc)
			fetch("http://localhost:3000/api/v1/games/dev/legalmoves",{
				method:"POST",
				headers:{
					"Content-Type":"application/json",
				},
				body:JSON.stringify({
					location:loc,
					gameid:localStorage.getItem("gameid")
				})
			}).then(k=>k.json()).then(
				data=>{
					console.log(data.data.moves)

					setHighlightedMoves(()=>data.data.moves)
				}
			)
		}
	}

	function algebraic(loc:string)
	{
		const [x,y]=loc.split(" ").map(k=>parseInt(k))
		return String.fromCharCode(97+x)+String.fromCharCode(49+y)
	}
	function moveHandler(from:string,to:string)
	{
		const move=algebraic(from)+algebraic(to);
		setHighlightedMoves(()=>[])
		console.log(move+"is being made")
		fetch("http://localhost:3000/api/v1/games/dev/makemove",{
			method:"POST",
			headers:{
				"Content-Type":"application/json",
			},
			body:JSON.stringify({
				move,
				gameid:localStorage.getItem("gameid")
			})
		}).then(k=>k.json()).then(
			data=>{
				console.log(data)
				// console.log(data.data.boardFEN)
				setPieceMap(()=>getMapFromFen(data.data.boardFEN))
			}
		)
	}


	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			const loc = j + " " + (7-i);
			cells.push(
				<ChessBoardCell
					color={
						highlightedMoves.includes(loc)
							? "green"
							: (i + j) % 2 == 0
							? "black"
							: "white"
					}
					key={loc}
					FEN={pieceMap[loc] || "x"}
					selected={selected}
					setSelected={setSelected}
					loc={loc}
					onHighlightMoves={fetchHighlightedMoves(loc)}
					onMakeMove={moveHandler}
				/>
			);
		}
	}
	return (
		<>
			<div className={styles.board}>{cells}</div>;
		</>
	);
}
interface BoardMap {
	[key: string]: string;
}

function getMapFromFen(fen: string) {
	const map:BoardMap = {};
	const rows = fen.substring(0,fen.indexOf(" ")).split("/");
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		let j = 0;
		for (let k = 0; k < row.length; k++) {
			const char = row[k];
			if (isNaN(parseInt(char))) {
				map[j + " " + (7-i)] = char;	
				j++;
			} else {
				j += parseInt(char);
			}
		}
	}
	
	return map;
}

export default ChessBoard;
