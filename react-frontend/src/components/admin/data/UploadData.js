import React, { useContext, useState } from "react";

// User Contexts
import { UserContext } from "../../../contexts/UserContext";

// Custom Components
import Error from "../../Error/Error";
import Stepper from "../../Stepper/Stepper";
import UploadStep1 from "./UploadSteps/UploadStep1";
import UploadStep2 from "./UploadSteps/UploadStep2";
import UploadStep3 from "./UploadSteps/UploadStep3";

function UploadData({ lgas, trendTypes }) {
	const { user } = useContext(UserContext);

	const [formData, setFormData] = useState({
		name: "",
		lga: "",
		fileData: null,
		colTypes: [],
	});

	const [state, setState] = useState({
		processing: false,
		loading: false,
		error: null,
		lgas: lgas,
		trendTypes: trendTypes,
		currentStep: 1,
	});

	if (state.error) {
		return <Error error={state.error} />;
	}

	const steps = [
		{
			id: 1,
			name: "Step 1: Upload",
			Component: UploadStep1,
			props: { formData, setFormData, state, setState, user },
		},
		{
			id: 2,
			name: "Step 2: Identify Data",
			Component: UploadStep2,
			props: { formData, setFormData, state, setState },
		},
		{
			id: 3,
			name: "Step 3: Review",
			Component: UploadStep3,
			props: { formData, setFormData, state, setState },
		},
	];

	return (
		<Stepper
			currentStep={state.currentStep}
			setCurrentStep={(step) => setState((s) => ({ ...s, currentStep: step }))}
			steps={steps}
			useButtons={true}
			buttonContainerClass="d-flex justify-content-end"
		/>
	);
}

export default UploadData;
