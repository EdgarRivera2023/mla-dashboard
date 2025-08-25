export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">
        Main Dashboard
      </h1>
      <p className="mt-4 text-lg">
        This is a protected page. Only logged-in users should see this.
      </p>
    </main>
  );
}