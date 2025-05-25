export default function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-600">{title}</h1>
        {children}
      </div>
    </div>
  );
}
