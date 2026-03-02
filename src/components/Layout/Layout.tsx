import Header from "./Header"
import Footer from "./Footer"
import './Layout.scss'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
