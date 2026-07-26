import BookingFlow from "./BookingFlow";
import {
  CourtStep,
  DateStep,
  DetailsStep,
  PackageStep,
  StepProgress,
  SuccessStep,
  TimeStep,
} from "./BookingSteps";

type BookingWizardProps = {
  defaultName: string;
  defaultPhone: string;
  defaultEmail: string;
  defaultPackageId?: string;
  defaultCourtId?: number;
  isAuthenticated: boolean;
};

export default function BookingWizard(props: BookingWizardProps) {
  return (
    <BookingFlow
      {...props}
      PackageStep={PackageStep}
      DateStep={DateStep}
      CourtStep={CourtStep}
      TimeStep={TimeStep}
      DetailsStep={DetailsStep}
      SuccessStep={SuccessStep}
      StepProgress={StepProgress}
    />
  );
}
