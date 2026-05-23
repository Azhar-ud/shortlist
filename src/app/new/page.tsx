import { Brand } from "@/components/Brand";
import { NewScreeningForm } from "@/components/NewScreeningForm";

export default function NewScreeningPage() {
  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-[1200px]">
        <Brand />
        <NewScreeningForm />
      </div>
    </div>
  );
}
