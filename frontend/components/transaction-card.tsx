"use client"

import { formatCurrency } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export interface TransactionProps {
  id: string
  amount: number
  type: "income" | "expense"
  category: string
  description: string
  date: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function TransactionCard({ id, amount, type, category, description, date, onEdit, onDelete }: TransactionProps) {
  const formattedDate = new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  })

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                type === "income"
                  ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {type === "income" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
            </div>
            <div>
              <p className="font-medium">{category}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p
                className={`font-medium ${
                  type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {type === "income" ? "+" : "-"}
                {formatCurrency(amount)}
              </p>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit && onEdit(id)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete && onDelete(id)} className="text-red-600 dark:text-red-400">
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

