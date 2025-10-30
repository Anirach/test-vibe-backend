export const exportToCSV = (transactions: any[]): string => {
  if (transactions.length === 0) {
    return 'id,type,amount,category,description,date,createdAt,updatedAt\n';
  }

  const headers = 'id,type,amount,category,description,date,createdAt,updatedAt\n';
  
  const rows = transactions.map((t: any) => {
    return [
      t.id,
      t.type,
      t.amount,
      t.category,
      `"${t.description.replace(/"/g, '""')}"`, // Escape quotes in description
      t.date.toISOString(),
      t.createdAt.toISOString(),
      t.updatedAt.toISOString(),
    ].join(',');
  }).join('\n');

  return headers + rows;
};

export const exportToJSON = (transactions: any[]): string => {
  return JSON.stringify(transactions, null, 2);
};
