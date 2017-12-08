export const loadLocalState = () => {
	try {
		const serializedState = localStorage.getItem('persisted_state');
		if(serializedState === null){
			return undefined;
		}
		return JSON.parse(serializedState);
	} catch(err) {
		return undefined;
	}	
};

export const saveLocalState = (state) => {
	try{
		const serializedState = JSON.stringify(state);
		localStorage.setItem('persisted_state',serializedState);
	} catch(err){

	}
}

export const destroyLocalState = () => {
	try{
		localStorage.removeItem('persisted_state');
	} catch(err){

	}
}