function Footer() {
  return (
    <footer className="mx-auto mt-auto flex w-full max-w-full items-center px-4 bg-blue-900 text-white">
      <div className="mt-4 flex w-full flex-col items-center justify-center gap-4 py-6">        
        <div className="flex gap-4">
          <a  href="https://github.com/devjaepal" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:font-semibold transition-transform duration-1000">
            GitHub
          </a>
          <a  href="https://velog.io/@jaepal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:font-semibold transition-transform duration-1000">
            Velog
          </a>
          <a  href="mailto:wocks3254@gamil.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:font-semibold transition-transform duration-1000">
            Contact
          </a>
          <a  href="https://www.instagram.com/jaechane"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:font-semibold transition-transform duration-1000">
            Instagram
          </a>
        </div>
        <p>© {new Date().getFullYear()} 이재찬 All Rights Reserved.</p>
      </div>
    </footer>
  );
}
export default Footer;
