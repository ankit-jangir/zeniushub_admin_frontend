import React from "react";
import { Button } from "../../src/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src/components/ui/table";
import { Wallet, User, CalendarIcon, Pencil, Trash2 } from "lucide-react";

const ExpenseTable = ({
  loading,
  isRefetching,
  currentExpenses,
  categoryExpenses,
  reversePaymentModeMapping,
  setEditingExpense,
  setIsAddExpenseOpen,
  handleDeleteExpense,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      {loading || isRefetching ? (
        <p className="text-center py-5">Loading...</p>
      ) : currentExpenses.length === 0 ? (
        <p className="text-center py-5">No expenses found.</p>
      ) : (
        <Table>
          <TableCaption>List of all expenses</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Referral</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentExpenses.map((expense, index) => (
              <TableRow key={expense.id}>
                <TableCell className="text-center">
                  <Wallet className="w-5 h-5 text-primary mx-auto" />
                </TableCell>
                <TableCell className="font-medium">{expense.name}</TableCell>
                <TableCell className="font-bold text-primary">
                  ₹{parseFloat(expense.amount).toFixed(2)}
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  <User className="w-4 h-4" /> {expense.referralName}
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" /> {expense.date}
                </TableCell>
                <TableCell>
                  {reversePaymentModeMapping[expense.paymentMethod] ||
                    expense.paymentMethod}
                </TableCell>
                <TableCell>
                  {categoryExpenses.find((cat) => cat.id === expense.categoryId)
                    ?.categoryName || "Unknown"}
                </TableCell>
                <TableCell className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingExpense(expense);
                      setIsAddExpenseOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ExpenseTable;
