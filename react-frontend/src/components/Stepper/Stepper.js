import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const Stepper = ({ currentStep, setCurrentStep, steps, useButtons = true }) => {
	const nextStep = () => {
		if (currentStep < steps.length) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const StepComponent = steps[currentStep - 1].Component;
	const props = steps[currentStep - 1].props;

	return (
		<Container>
			<Row className="mb-4">
				<Col>
					<div className="d-flex justify-content-between">
						{steps.map((step, index) => (
							<div
								key={index}
								className={`step ${index <= currentStep - 1 ? "active" : ""}`}
								style={{
									width: "100%",
									textAlign: "center",
									padding: "10px",
									borderBottom:
										index <= currentStep - 1
											? "2px solid #007bff"
											: "2px solid #ccc",
								}}
							>
								{step.name}
							</div>
						))}
					</div>
				</Col>
			</Row>
			<Row>
				<Col>
					<StepComponent {...props} />
				</Col>
			</Row>
			{useButtons && (
				<Row className="mt-4">
					<Col>
						<Button
							variant="secondary"
							onClick={prevStep}
							disabled={currentStep === 1}
						>
							Previous
						</Button>
						<Button
							variant="primary"
							onClick={nextStep}
							className="ml-2"
							disabled={currentStep === steps.length}
						>
							Next
						</Button>
					</Col>
				</Row>
			)}
		</Container>
	);
};

export default Stepper;
