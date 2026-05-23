import { Shell, PageHeader } from "@/components/Shell";
import { NewScreeningForm } from "@/components/NewScreeningForm";

export default function NewScreeningPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="New screening"
        title="Paste a job and resumes."
        description="The model will score, rank, and reason about fit — with cited evidence. Each screening gets a shareable URL the moment it starts."
      />
      <NewScreeningForm />
    </Shell>
  );
}
