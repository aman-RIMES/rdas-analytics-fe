import { NavLink, Outlet } from "react-router-dom";
function App() {
  const array: any = [1, 2, 3, 4, 5];
  return (
    <div className="flex flex-col gap-3">
      {array.map((element: any) => {
        return (
          <NavLink
            className={({ isActive }) => {
              return isActive ? "text-primary-700" : "";
            }}
            key={element}
            to={`/content/${element}`}
          >
            Content {element}
          </NavLink>
        );
      })}
      <Outlet />
    </div>
  );
}

export default App;
