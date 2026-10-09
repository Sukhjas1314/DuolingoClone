import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";

interface ComingSoonProps {
  title?: string;
  description?: string;
  onBack?: () => void;
  backText?: string;
}

export function ComingSoon({ 
  title = "Coming Soon!", 
  description = "Our developers (and owls) are working hard on this feature.", 
  onBack, 
  backText = "BACK TO LEARN" 
}: ComingSoonProps) {
  const router = useRouter();
  const handleBack = () => {
    if (onBack) onBack();
    else router.push("/learn");
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 gap-6 max-w-md mx-auto">
      <Mascot state="sad" className="w-40 h-40 opacity-80" />
      <h2 className="text-3xl font-bold text-duo-textDark dark:text-white">{title}</h2>
      <p className="text-duo-textLight font-medium text-lg">{description}</p>
      <Button variant="primary" size="lg" className="mt-4 w-full" onClick={handleBack}>
        {backText}
      </Button>
    </div>
  );
}

export function ComingSoonModal({ isOpen, onClose, featureName }: { isOpen: boolean, onClose: () => void, featureName?: string }) {
  return (
    <Modal isOpen={isOpen}>
      <ComingSoon 
        title={`${featureName || "Feature"} Coming Soon!`}
        onBack={onClose}
        backText="CLOSE"
      />
    </Modal>
  );
}
