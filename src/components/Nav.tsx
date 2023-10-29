import Logo from "./Logo"
import Navlist from "./Navlist"

export default function Nav() {
  return (
    <nav className="nav-container">
      <div className="nav">
        <Logo />

        <Navlist />

        <button className="button hidden lg:block">login</button>
      </div>
    </nav>
  )
}
