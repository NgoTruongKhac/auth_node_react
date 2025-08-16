import logo_full from "../assets/images/logo_full.png";

export default function NoSelectConversation() {
  return (
    // Main container: Centers content vertically and horizontally with a light background color
    <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-base-100 text-center border">
      {/* Wrapper to limit width and manage spacing between elements */}
      <div className="max-w-md flex flex-col items-center gap-4">
        {/* 1. App Logo */}
        <img
          src={logo_full}
          alt="App Logo"
          className="w-40 md:w-48 h-auto mb-4" // Responsive logo size
        />

        {/* 2. Welcome Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">
          Welcome Back!
        </h1>

        {/* 3. Slogan */}
        <p className="text-lg text-base-content/80 italic">
          "Limitless connections, sharing every moment."
        </p>

        {/* 4. Instructions/Description */}
        <p className="mt-4 text-base-content/70">
          Select a friend from the list on the left to start a conversation.
          <br />
          Or use the search to discover new connections!
        </p>

        {/* 5. Decorative Divider */}
        <div className="divider my-2 md:my-4 text-2xl">✨</div>

        {/* 6. Security Message (optional but adds professionalism) */}
        <p className="text-sm text-base-content/50">
          All your conversations are secure.
        </p>
      </div>
    </div>
  );
}
