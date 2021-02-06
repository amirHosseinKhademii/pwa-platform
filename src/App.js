import axios from "axios";

import { useQuery } from "react-query";
function App() {
  const { data } = useQuery(
    "test",
    async () => await axios.get("https://jsonplaceholder.typicode.com/todos")
  );
  return (
    <div>
      <ul>
        {data &&
          data.data.map((item, index) => <li key={index}>{item.title}</li>)}
      </ul>
    </div>
  );
}

export default App;
