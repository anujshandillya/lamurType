import Keyboard from "@/components/Keyboard";
import Solo from "@/components/Solo/Solo";

export default function SoloPage() {
  return (
    <>
      <Solo />

      <div className="mt-8 flex flex-col items-center justify-center gap-2 font-primary">
        <div className="flex items-center space-x-2 text-sm">
          <Keyboard>tab</Keyboard>
          <span className="text-hl"> + </span>
          <Keyboard>enter</Keyboard>
          <span className="text-hl"> - restart test </span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Keyboard>ctrl/cmd</Keyboard>
          <span className="text-hl"> + </span>
          <Keyboard>k</Keyboard>
          <span className="text-hl"> or </span>
          <Keyboard>p</Keyboard>
          <span className="text-hl"> - command palette </span>
        </div>
      </div>
      </>
    
  );
}
