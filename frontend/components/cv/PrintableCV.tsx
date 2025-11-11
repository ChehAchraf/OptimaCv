import React from "react";
import { CVPreview } from "./CVPreview";
import { CVData } from "@/types/cv";

interface PrintableCVProps {
  template: string;
  data: CVData;
}

export const PrintableCV = React.forwardRef<HTMLDivElement, PrintableCVProps>(
  ({ template, data }, ref) => {
    return (
      <div ref={ref}>
        <CVPreview template={template} data={data} />
      </div>
    );
  }
);

PrintableCV.displayName = "PrintableCV";
