import { useAuthContext } from "@/context/User/UserAuthContext";
import Iconify from "./Iconify";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useLogout } from "@/api/use-auth";
import { useRouter } from "@/hooks/use-router";

type HeaderProps = {
  className?: React.HTMLAttributes<HTMLElement>["className"];
};

const Header = ({ className }: HeaderProps) => {
  const { user, dispatch } = useAuthContext()
  const { logout } = useLogout()
  const { router } = useRouter()

  const handleLogout = async () => {
    const result = await logout()
    if (result.error) {
      console.log(result.error)
    } else {
      dispatch({ type: 'LOGOUT' })
      router.replace('/auth/login')
    }
  }

  return (
    <header
      className={`${className} flex h-12 w-full items-center justify-around p-4`}
    >
      <Link to="/">
        <div className="flex items-center gap-2 space-x-2">
          <Iconify icon="streamline-flex:keyboard-solid" className="text-lg" />
          <h2 className="text-lg font-mono font-bold">LamurType</h2>
        </div>
      </Link>
      <nav>
        <ul className="flex font-mono space-x-4">
          <Link to="/profile?tab=leaderboard">Leaderboard</Link>
          {user.isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>Account</DropdownMenuTrigger>
              <DropdownMenuContent className="font-mono">
                {user && <DropdownMenuLabel>{`${user.first_name} ${user.last_name}`}</DropdownMenuLabel>}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth/login">Login</Link>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
