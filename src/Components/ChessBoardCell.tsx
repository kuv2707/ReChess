import styles from "./ChessBoardCell.module.css";

//declare variable map which maps p to bp n to bp P to wp etc
const map: Record<string, string> = {
	p: "bp",
	n: "bn",
	b: "bb",
	r: "br",
	q: "bq",
	k: "bk",
	P: "wp",
	N: "wn",
	B: "wb",
	R: "wr",
	Q: "wq",
	K: "wk",
};
function transform(FEN: string) {
	return map[FEN] || "";
}
interface CellProps {
	color: string;
	FEN: string;
	selected: string;
	setSelected: React.Dispatch<React.SetStateAction<string>>;
	loc: string;
	onHighlightMoves: () => void;
	onMakeMove: (from:string,to:string) => void;
}

function ChessBoardCell({
	color,
	FEN,
	selected,
	setSelected,
	loc,
	onHighlightMoves,
    onMakeMove,
}: CellProps) {
	function clickHandler() {
		if (selected == "") {
			setSelected(() => loc);
			onHighlightMoves();
		} else {
            setSelected(()=>"")
            onMakeMove(selected,loc)
		}
	}

	if (color == "white") color = "#f0d9b5";
	if (color == "black") color = "#b58863";
	return (
		<div
			className={styles.cell}
			style={{
				backgroundColor: selected === loc ? "brown" : color,
			}}
			onClick={clickHandler}
		>
			{FEN != "x" && (
				<img
					className={styles.piecePicture}
					src={"/src/assets/Cats/" + transform(FEN) + ".svg"}
					alt=""
				/>
			)}
			
		</div>
	);
}

export default ChessBoardCell;
