import ResumeForm from './components/ResumeForm'
import './App.css'

function App() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] text-foreground relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10">
        <ResumeForm />
      </div>
      
      <footer className="relative z-10 py-10 text-center border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Resume Architect. Built with React & Django.
        </p>
      </footer>
    </main>
  )
}

export default App
