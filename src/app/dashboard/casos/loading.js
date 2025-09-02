export default function Loading() {
  // This is a "loading skeleton" of the page.
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            All Cases
          </h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="block rounded-md bg-gray-300 py-2 px-4 h-9 w-32 animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <div className="h-96 w-full rounded-lg bg-gray-300 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}