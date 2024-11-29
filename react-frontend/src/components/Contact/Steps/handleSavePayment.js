import postRequest from "../../lib/postRequest";

// Save the quote to the database
const handleSavePayment = (e, state, setState, newClient, setNewClient) => {
	e.preventDefault();
	const saveQuote = async () => {
		setState((s) => ({ ...s, loading: true }));
		const clientToSend = {
			...newClient,
			amount: state.price.type + state.price.locations + state.price.type,
		};

		const [response, error] = await postRequest(
			state.type,
			{ newClient: clientToSend },
			false
		);

		if (error) {
			console.error(error);
			setState((s) => ({ ...s, error: error }));
		} else {
			setNewClient((s) => ({
				...s,
				quoteRef: response.results.quoteRef,
				expires_at: response.results.expires_at,
			}));
			setState((s) => ({ ...s, currentStep: 4 }));
		}
		setState((s) => ({ ...s, loading: false }));
	};
	saveQuote();
};

export default handleSavePayment;
