import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseComparison as ExpenseComparisonType } from "@/types";

const ExpenseComparison: React.FC<{ data: ExpenseComparisonType }> = ({ data }) => {
  const weekPercentage = parseFloat(data.percentageComparison.week);
  const monthPercentage = parseFloat(data.percentageComparison.month);

  const valueForWeek = weekPercentage > 0 ? weekPercentage : 0;
  const valueForMonth = monthPercentage > 0 ? monthPercentage : 0;

  return (
    <>
      <Card x-chunk="dashboard-05-chunk-1">
        <CardHeader className="pb-2">
          <CardDescription>This Week</CardDescription>
          <CardTitle className="text-4xl">₹{data.weekExpense}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {data.percentageComparison.week} from last week
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={valueForWeek} aria-label={`${data.percentageComparison.week}% increase`} />
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-05-chunk-2">
        <CardHeader className="pb-2">
          <CardDescription>This Month</CardDescription>
          <CardTitle className="text-4xl">₹{data.monthExpense}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {data.percentageComparison.month} from last month
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={valueForMonth} aria-label={`${data.percentageComparison.month}% increase`} />
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-05-chunk-3">
        <CardHeader className="pb-2">
          <CardDescription>Overall Expenses</CardDescription>
          <CardTitle className="text-4xl">₹{data.overallExpenseAmount}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-gray-500">
            &#34;Frugality is not about depriving yourself of things you want, but about being mindful of the things you need&#34;
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default ExpenseComparison;
