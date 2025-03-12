import Link from "next/link"
import { Bell, FileText, Settings, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeaderMenu() {
  return (
    <div className="block lg:hidden">
      <div className="flex items-center gap-2">
        <Link href="/categories">
          <Button variant="ghost" size="icon">
            <Tag className="h-5 w-5" />
            <span className="sr-only">Kategori</span>
          </Button>
        </Link>
        <Link href="/reports">
          <Button variant="ghost" size="icon">
            <FileText className="h-5 w-5" />
            <span className="sr-only">Laporan</span>
          </Button>
        </Link>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifikasi</span>
        </Button>
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Pengaturan</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}