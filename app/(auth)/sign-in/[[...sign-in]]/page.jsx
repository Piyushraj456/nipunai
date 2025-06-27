import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-purple-100 flex items-center justify-center">
      <div className="w-full h-full max-w-[95vw] max-h-[90vh] grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Left Image + Text */}
        <div
          className="relative bg-cover bg-center p-10 text-white flex flex-col justify-end"
          style={{
            backgroundImage: `url('https://assets.seobotai.com/cdn-cgi/image/quality=75,w=1536,h=1024/acedit.ai/681019a50e18f2b0151d840c-1745890690784.jpg')`,
          }}
        >
          <div className="bg-black/40 p-4 rounded-xl backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">Welcome to NipunAI 🧠</h2>
            <p className="text-sm text-white">
              Your go-to interview preparation site — practice, improve,<br />
              and ace your interviews in minutes.
            </p>
          </div>
        </div>

        {/* Right SignIn Form */}
        <div className="flex items-center justify-center bg-gray-100 p-6 md:p-10">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
