const Navbar = () => {
  const sheets = [{ id: 0, name: "main" }]
  return (
    <div className="border-b border-gray-500 px-2 py-0.5 flex">
      {sheets.map((sheet) => (
        <div key={sheet.id} className="underline cursor-pointer">
          {sheet.name}
        </div>
      ))}
    </div>
  )
}

export default Navbar
