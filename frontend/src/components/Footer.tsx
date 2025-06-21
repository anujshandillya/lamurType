import { Link } from "react-router-dom";
import Iconify from "./Iconify";

type FooterProps = {
  className?: React.HTMLAttributes<HTMLElement>["className"];
};

const Footer = ({ className }: FooterProps) => {
  return (
    <footer
      className={`${className} flex h-16 w-full items-center justify-around p-4`}
    >
      <div className="flex items-center gap-2 space-x-2">
        <Link to="https://github.com/anujshandillya/lamurType" className="flex items-center gap-2 hover:text-cyan-500">
          <Iconify icon="mdi:github" width={32} />
          <h2 className="text-lg font-bold text-grey">Github</h2>
        </Link>
      </div>
      <div className="flex items-center gap-4 space-x-2 h-16">
        <h2 className="text-sm font-bold text-grey">Made with:</h2>
        <Iconify className="opacity-70 hover:opacity-100" icon="logos:nodejs-icon" width={32} color="grey" />
        <Iconify className="opacity-70 hover:opacity-100" icon="vscode-icons:file-type-mongo" width={32} color="grey" />
        <Iconify className="opacity-70 hover:opacity-100" icon="material-icon-theme:react" width={32} color="grey" />
        <Iconify className="opacity-70 hover:opacity-100" icon="devicon:redis" width={32} color="grey" />
        <Iconify className="opacity-70 hover:opacity-100" icon="vscode-icons:file-type-js" width={32} color="grey" />
        <Iconify className="opacity-70 hover:opacity-100" icon="vscode-icons:file-type-typescript" width={32} color="grey" />
        <Iconify className="opacity-70 hover:opacity-100" icon="material-icon-theme:go" width={32} color="grey" />
        <Iconify className="opacity-70 hover:opacity-100" icon="logos:socket-io" width={32} color="grey" />
        <Iconify className="opacity-70 hover:opacity-100" icon="material-icon-theme:docker" width={32} color="grey" />
      </div>
    </footer>
  );
};

export default Footer;
