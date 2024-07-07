import { useEffect, useState } from "react";
import "./App.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
function App() {
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    async function fetchTotalSpent() {
      const response = await fetch("/api/expenses/total-spent");
      const data = await response.json();
      setTotalSpent(data.totalSpent);
    }
    fetchTotalSpent();
  }, []);

  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>
            The total amount spent on your project.
          </CardDescription>
        </CardHeader>
        <CardContent>{totalSpent}</CardContent>
      </Card>
    </>
  );
}

export default App;
