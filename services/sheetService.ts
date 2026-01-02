
import { Transaction } from "../types";

const STORAGE_KEY = 'findash_transactions';
const SHEET_URL_KEY = 'findash_sheet_url';

export class SheetService {
  static getTransactions(): Transaction[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getSheetUrl(): string {
    return localStorage.getItem(SHEET_URL_KEY) || '';
  }

  static setSheetUrl(url: string): void {
    localStorage.setItem(SHEET_URL_KEY, url);
  }

  static async saveTransaction(transaction: Transaction): Promise<boolean> {
    // 1. Save locally first for offline support and speed
    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));

    // 2. Real Auto-Sync to Google Sheets if URL is provided
    const sheetUrl = this.getSheetUrl();
    if (!sheetUrl) {
      console.warn("No Google Sheet URL configured. Data saved locally only.");
      return true;
    }

    try {
      const response = await fetch(sheetUrl, {
        method: 'POST',
        mode: 'no-cors', // Use no-cors for simple Google Apps Script triggers
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      
      console.log("Successfully triggered sync to Google Sheets.");
      return true;
    } catch (error) {
      console.error("Failed to sync to Google Sheets:", error);
      return false;
    }
  }

  static getDailyReports(transactions: Transaction[]) {
    const groups: { [key: string]: any } = {};
    
    transactions.forEach(t => {
      if (!groups[t.date]) {
        groups[t.date] = { date: t.date, receipts: 0, payments: 0, transactions: [] };
      }
      if (t.type === 'RECEIPT') groups[t.date].receipts += t.amount;
      if (t.type === 'PAYMENT') groups[t.date].payments += t.amount;
      groups[t.date].transactions.push(t);
    });

    return Object.values(groups).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  static exportToCSV(transactions: Transaction[]) {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Method', 'Reference'];
    const rows = transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.description,
      t.amount,
      t.paymentMethod,
      t.reference || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `findash_sheet_sync_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
