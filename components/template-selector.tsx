import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
}

const templates = [
  {
    id: "modern",
    nameKey: "site.builder.templates.options.modern",
    descriptionKey: "site.builder.templates.descriptions.modern",
    image: "/templates/modern.png",
  },
  {
    id: "classic",
    nameKey: "site.builder.templates.options.classic",
    descriptionKey: "site.builder.templates.descriptions.classic",
    image: "/templates/classic.png",
  },
  {
    id: "pro",
    nameKey: "site.builder.templates.options.pro",
    descriptionKey: "site.builder.templates.descriptions.pro",
    image: "/templates/pro.png",
  },
];

export function TemplateSelector({
  open,
  onOpenChange,
  selectedTemplate,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {t("site.builder.templates.select_template")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 p-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all hover:border-teal-500",
                selectedTemplate === template.id
                  ? "border-teal-500 ring-2 ring-teal-500"
                  : "border-gray-200"
              )}
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className="aspect-[210/297] w-full">
                <Image
                  src={template.image || "/placeholder.svg"}
                  alt={t(template.nameKey)}
                  width={210}
                  height={297}
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 className="text-lg font-semibold text-white">
                  {t(template.nameKey)}
                </h3>
                <p className="text-sm text-gray-200">
                  {t(template.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
