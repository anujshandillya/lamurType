import Iconify from "./Iconify";

type HeaderProps = {
  className?: React.HTMLAttributes<HTMLElement>["className"];
};

const Header = ({ className }: HeaderProps) => {
  return (
    <header
      className={`${className} flex h-12 w-full items-center justify-around p-4`}
    >
      <div className="flex items-center gap-2 space-x-2">
        <Iconify icon="streamline-flex:keyboard-solid" className="text-lg" />
        <h2 className="text-lg font-bold">LamurType</h2>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
