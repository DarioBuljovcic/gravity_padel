
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

const CTAButton = ({ className }: { className?: string }) => {
    const t = useTranslations('CTAButton');

    return (
        <Link
            // href="/rezervacija"
            href="https://gravitysport.simplybook.me/v2/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn("flex items-center gap-2 px-8 py-4 bg-padel-blue text-white font-black uppercase tracking-widest text-sm hover:bg-blue-600 transition-all duration-300 rounded-lg shadow-lg shadow-padel-blue/20 btn-press", className)}
        >
            <CalendarIcon />
            {t('bookBtn')}
        </Link>
    )
}

export default CTAButton