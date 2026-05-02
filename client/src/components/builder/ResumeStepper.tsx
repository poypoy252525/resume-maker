import { Badge } from "@/components/reui/badge";
import {
  StepperItem,
  StepperNav,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperSeparator,
} from "@/components/reui/stepper";
import { sidebarItems } from "@/constants/builder";

export default function ResumeStepper() {
  return (
    <StepperNav className="w-full gap-2 md:gap-3">
      {sidebarItems.map((item, index) => (
        <StepperItem
          key={item.step}
          step={item.step}
          className="relative flex-1 items-start"
        >
          <StepperTrigger
            className="flex grow flex-col items-center md:items-start justify-center gap-1.5 md:gap-2.5 px-2 md:px-3 py-1.5 rounded-xl transition-colors hover:bg-secondary/20"
            asChild
          >
            <div>
              <StepperIndicator className="data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground data-[state=completed]:bg-success size-7 md:size-8 border-2 data-[state=completed]:text-white data-[state=inactive]:bg-transparent">
                <item.icon className="size-3.5 md:size-4" />
              </StepperIndicator>
              <div className="flex flex-col items-center md:items-start gap-1">
                <div className="text-muted-foreground text-[8px] md:text-[10px] font-semibold uppercase tracking-wider hidden sm:block">
                  Step {item.step}
                </div>
                <StepperTitle className="group-data-[state=inactive]/step:text-muted-foreground text-center md:text-start text-[10px] md:text-sm font-semibold">
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="md:hidden">{item.label.split(" ")[0]}</span>
                </StepperTitle>
                <div className="hidden md:block">
                  <Badge
                    size="xs"
                    variant="primary-light"
                    className="hidden group-data-[state=active]/step:inline-flex"
                  >
                    In Progress
                  </Badge>
                  <Badge
                    variant="success-light"
                    size="xs"
                    className="hidden group-data-[state=completed]/step:inline-flex"
                  >
                    Completed
                  </Badge>
                  <Badge
                    variant="secondary"
                    size="xs"
                    className="text-muted-foreground hidden group-data-[state=inactive]/step:inline-flex"
                  >
                    Pending
                  </Badge>
                </div>
              </div>
            </div>
          </StepperTrigger>

          {sidebarItems.length > index + 1 && (
            <StepperSeparator className="group-data-[state=completed]/step:bg-success absolute inset-x-0 inset-s-7 md:inset-s-9 top-3.5 md:top-4 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-1.5rem)] md:group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
          )}
        </StepperItem>
      ))}
    </StepperNav>
  );
}
