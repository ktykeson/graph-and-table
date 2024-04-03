const Popup = ({ message, confirm, tryagain, correct }) => {
	return (
		<div className="dialog_box">
			<h2 className="dialog_message">{message}</h2>
			<div className="dialog_button_container">
				<button onClick={confirm} className="dialog_confirmation" type="button">
				Reset
				</button>
				{!correct && (<button onClick={tryagain} className="dialog_confirmation" type="button">
				Try Again
				</button>)}
			</div>
		</div>
	);
};

export default Popup;
