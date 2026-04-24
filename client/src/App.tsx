import ResumeForm from './components/ResumeForm'
import { Toaster } from './components/ui/sonner'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-primary/8 blur-[160px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 rounded-full bg-violet-600/6 blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full bg-indigo-500/4 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <ResumeForm />
      </div>
      <Toaster />
    </div>
  )
}

export default App
