import Keyboard from "@/components/Keyboard";
import Solo from "@/components/Solo/Solo";
import { usePreferenceContext } from "@/context/Preference/PreferenceContext";

export default function SoloPage() {
  const { preferences: { theme } } = usePreferenceContext();
  
  return (
    <>
      <Solo />

      <div className="mt-8 flex flex-col items-center justify-center gap-2 font-primary">
        <div className="flex items-center space-x-2 text-sm">
          <Keyboard>tab</Keyboard>
          <span className={`text-${theme}-hl`}> + </span>
          <Keyboard>enter</Keyboard>
          <span className={`text-${theme}-hl`}> - restart test </span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Keyboard>ctrl/cmd</Keyboard>
          <span className={`text-${theme}-hl`}> + </span>
          <Keyboard>k</Keyboard>
          <span className={`text-${theme}-hl`}> or </span>
          <Keyboard>p</Keyboard>
          <span className={`text-${theme}-hl`}> - command palette </span>
        </div>
      </div>
      </>
    
  );
}
