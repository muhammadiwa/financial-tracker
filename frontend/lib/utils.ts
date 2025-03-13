import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function getMonthName(month: number): string {
  return new Intl.DateTimeFormat("id-ID", { month: "long" }).format(new Date(2000, month - 1, 1))
}

export function getRandomColor(index: number): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ]
  return colors[index % colors.length]
}

export function groupTransactionsByDate(transactions: Transaction[]) {
  if (!transactions || transactions.length === 0) return {}
  
  return transactions.reduce((groups: Record<string, Transaction[]>, transaction) => {
    const date = format(parseISO(transaction.date), "d MMMM yyyy", { locale: id })
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {})
}

