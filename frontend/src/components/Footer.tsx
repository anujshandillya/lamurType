import { Link } from "react-router-dom";
import Iconify from "./Iconify";

type FooterProps = {
  className?: React.HTMLAttributes<HTMLElement>["className"];
  theme?: string;
};

const Footer = ({ className, theme }: FooterProps) => {
  return (
    <footer
      className={`${className} flex h-16 w-full items-center justify-around p-4`}
    >
      <div className="flex items-center gap-2 space-x-2">
        <Link to="https://github.com/anujshandillya/lamurType" className="flex items-center gap-2 hover:text-cyan-500">
          <Iconify icon="mdi:github" width={32} />
          <h2 className="text-lg font-bold">Github</h2>
        </Link>
      </div>
      <div className="flex items-center gap-4 space-x-2 h-16">
        <h2 className="text-sm font-bold">Made with:</h2>
        <Iconify className={`text-${theme}-font`} icon="akar-icons:node-fill" width={32} />
        <Iconify className={`text-${theme}-font`} icon="flowbite:mongo-db-solid" width={32} />
        <Iconify className={`text-${theme}-font`} icon="mdi:react" width={32} />
        <Iconify className={`text-${theme}-font`} icon="simple-icons:redis" width={32} />
        <Iconify className={`text-${theme}-font`} icon="cib:js" width={32} />
        <Iconify className={`text-${theme}-font`} icon="akar-icons:typescript-fill" width={28} />
        <Iconify className={`text-${theme}-font`} icon="file-icons:go" width={32} />
        <Iconify className={`text-${theme}-font`} icon="cib:socket-io" width={32} />
        <Iconify className={`text-${theme}-font`} icon="devicon-plain:docker" width={32} />
      </div>
    </footer>
  );
};

export default Footer;
