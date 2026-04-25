import ResumeForm from "../components/ResumeForm";

/**
 * NewResume Page
 * This is the entry point for the builder workspace.
 * It is wrapped in BuilderLayout in App.tsx.
 */
export default function NewResume() {
  return (
    <div className="h-full w-full overflow-y-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <ResumeForm />
      </div>
    </div>
  );
}
