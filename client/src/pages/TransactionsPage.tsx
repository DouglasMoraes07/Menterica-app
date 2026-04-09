import React, { useState } from 'react';

// Sample Transaction Type
type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
};

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);

  const addTransaction = () => {
    const newTransaction = {
      id: transactions.length + 1,
      description,
      amount,
      type: amount > 0 ? 'income' : 'expense',
      date: new Date().toISOString(),
    };
    setTransactions([...transactions, newTransaction]);
    setDescription('');
    setAmount(0);
  };

  const filteredTransactions = transactions.filter(transaction => 
    filter === 'all' || transaction.type === filter
  );

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const budget = totalIncome + totalExpense;

  return (
    <div>
      <h1>Transactions Page</h1>

      <h2>Add Transaction</h2>
      <input 
        type="text" 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        placeholder="Description"
      />
      <input 
        type="number" 
        value={amount} 
        onChange={e => setAmount(Number(e.target.value))} 
        placeholder="Amount"
      />
      <button onClick={addTransaction}>Add Transaction</button>

      <h2>Filters</h2>
      <select onChange={e => setFilter(e.target.value as 'all' | 'income' | 'expense')}>
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <h2>Transaction History</h2>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.description}</td>
              <td>${transaction.amount}</td>
              <td>{transaction.type}</td>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Budget Overview</h2>
      <p>Total Income: ${totalIncome}</p>
      <p>Total Expense: ${totalExpense}</p>
      <p>Budget: ${budget}</p>
    </div>
  );
};

export default TransactionsPage;
