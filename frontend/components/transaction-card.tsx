"use client"

import { formatCurrency } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export interface Transaction {
  id: string
  amount: number
  type: "income" | "expense"
  category: string
  description: string
  date: string
  color: string
}

interface TransactionCardProps extends Transaction {
  onClick?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TransactionCard({
  id,
  amount,
  type,
  category,
  description,
  color,
  date,
  onClick,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              {/* Icon based on category */}
            </div>
            <div>
              <p className="font-medium">{description}</p>
              <p className="text-sm text-muted-foreground">{category}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-medium ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {type === 'income' ? '+' : '-'}{formatCurrency(amount)}
            </p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

