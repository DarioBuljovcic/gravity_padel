import type { LabeledCourt } from "@/lib/courts";
import BookingFlow from "./BookingFlow";
import {
  type BookingMode,
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
  courts: LabeledCourt[];
  mode?: BookingMode;
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
