export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form>
        <input type="text" name="name" />
        <button type="submit">Update User Name</button>
      </form>
    </main>
  );
}
