'use client'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from '@/i18n/navigation'
import { useState } from 'react'

export default function DishDetailModal({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [open, setOpen] = useState(true)

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open)
                if (!open) router.back()
            }}
        >
            <DialogContent aria-describedby={undefined} className='max-h-full overflow-auto'>
                <DialogTitle></DialogTitle>
                {children}
            </DialogContent>
        </Dialog>
    )
}