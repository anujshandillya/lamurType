import { ToastContainer as ToastContainerBase } from "react-toastify";
import Iconify from "./Iconify";
import { usePreferenceContext } from "@/context/Preference/PreferenceContext";

export default function ToastContainer() {
    const { preferences: {theme} } = usePreferenceContext();
    return (
        <ToastContainerBase
        toastClassName={() =>
          `relative flex p-1 mt-4 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-${theme}-hl text-bg border-2 border-hl mx-4`
        }
        className={() =>
          'flex px-2 py-2 text-sm font-primary block accent-hl'
        }
        closeButton={() => (
          <Iconify icon="mdi:close" className={`text-${theme}-bg/80 transition-colors duration-200 hover:text-${theme}-bg`} />
        )}
        />
    )
}