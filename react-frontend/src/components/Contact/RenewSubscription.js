import React, { useState, useEffect, useContext } from "react";

// Contexts
import { UserContext } from "../../contexts/UserContext";

// Custom Components
import getRequest from "../lib/getRequest";
import Stepper from "../Stepper/Stepper";
import Error from "../Error/Error";
import Loading from "../Loading";
import RenewStep1 from "./Steps/RenewStep1";
import SubscribeStep2 from "./Steps/SubscribeStep2";
import SubscribeStep3 from "./Steps/SubscribeStep3";
import SubscribeStep4 from "./Steps/SubscribeStep4";

const RenewSubscription = () => {
	const { user } = useContext(UserContext);

	const [newClient, setNewClient] = useState({
		name: user.name,
		email: user.email,
		client_id: user.client.id,
		clientName: "",
		clientType: "",
		lgaIds: [],
		lgas: [],
		licenses: 0,
		message: "",
		amount: 0,
		paymentMethod: "Payment Pending",
		quoteRef: "",
	});

	const [state, setState] = useState({
		loading: false,
		error: null,
		price: { locations: 0, users: 0, type: 0 },
		lgas: [],
		type: "renew",
		currentStep: 1,
	});

	// Fetch the licenses
	useEffect(() => {
		const fetchData = async () => {
			setState((s) => ({ ...s, loading: true, error: null }));
			const [clientList, clientError] = await getRequest("client/list");
			const [data, error] = await getRequest("lga/list", false);

			if (clientError || error) {
				console.error(clientError, error);
				setState((s) => ({ ...s, error: clientError ? clientError : error }));
			} else {
				let client = clientList.results[0];
				setNewClient((s) => ({
					...s,
					clientName: client.c_name,
					clientType: client.c_type,
					lgaIds: user.client.lgaIds,
					lgas: data.results
						.map((lga) =>
							user.client.lgaIds.includes(lga.id) ? lga.lga_name : null
						)
						.filter((lga) => lga !== null),
					licenses: client.licenses,
					expires_at: client.expires_at,
				}));
				setState((s) => ({ ...s, lgas: data.results }));
			}
			setState((s) => ({ ...s, loading: false }));
		};
		fetchData();
	}, []);

	if (state.error) {
		return <Error error={state.error} />;
	}

	if (state.loading) {
		return <Loading />;
	}

	const steps = [
		{
			id: 1,
			name: "Step 1: Information",
			Component: RenewStep1,
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

export default RenewSubscription;
