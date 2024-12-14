import React, { useEffect, useState } from "react";

// Custom Components
import getRequest from "../lib/getRequest";
import Stepper from "../Stepper/Stepper";
import Error from "../Error/Error";
import Loading from "../Loading";
import SubscribeStep1 from "./Steps/SubscribeStep1";
import SubscribeStep2 from "./Steps/SubscribeStep2";
import SubscribeStep3 from "./Steps/SubscribeStep3";
import SubscribeStep4 from "./Steps/SubscribeStep4";

const Contact = () => {
	// State variables for user input
	const [newClient, setNewClient] = useState({
		name: "",
		email: "",
		clientName: "",
		clientType: "",
		lgaIds: [],
		licenses: 1,
		message: "",
		amount: 0,
		paymentMethod: "Payment Pending",
		quoteRef: "",
	});

	const [state, setState] = useState({
		loading: false,
		error: null,
		lgas: [],
		price: { locations: 0, users: 0, type: 0 },
		type: "subscribe",
		currentStep: 1,
		pricePerUser: 25,
		formError: null,
	});

	// Fetches the list of local government areas
	useEffect(() => {
		const getLgas = async () => {
			setState((s) => ({ ...s, loading: true, error: null }));
			const [data, error] = await getRequest("lga/list", false);
			if (error) {
				console.error(error);
				setState((s) => ({ ...s, error: error }));
			} else {
				setState((s) => ({ ...s, lgas: data.results }));
			}
			setState((s) => ({ ...s, loading: false }));
		};

		getLgas();
	}, []);

	if (state.loading) {
		return <Loading />;
	}

	if (state.error) {
		return <Error error={state.error} />;
	}

	const steps = [
		{
			id: 1,
			name: "Step 1: Information",
			Component: SubscribeStep1,
			props: { newClient, setNewClient, state, setState },
		},
		{
			id: 2,
			name: "Step 2: Price Summary",
			Component: SubscribeStep2,
			props: { newClient, setNewClient, state, setState },
		},
		{
			id: 3,
			name: "Step 3: Payment",
			Component: SubscribeStep3,
			props: { newClient, setNewClient, state, setState },
		},
		{
			id: 4,
			name: "Step 4: Confirmation",
			Component: SubscribeStep4,
			props: { newClient, setNewClient, state, setState },
		},
	];

	return (
		<Stepper
			currentStep={state.currentStep}
			setCurrentStep={(step) => setState((s) => ({ ...s, currentStep: step }))}
			steps={steps}
			useButtons={false}
		/>
	);
};

export default Contact;
