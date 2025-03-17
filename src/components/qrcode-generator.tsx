'use client'
import { getTableLink } from '@/lib/utils'
import QRCode from 'qrcode'
import { useEffect, useRef } from 'react'

export type QRCodeTableProps = {
    token: string,
    tableNumber: number
}

export default function QRCodeTable({ payload, styles = '' }: { payload: QRCodeTableProps, styles?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const canvas = canvasRef.current
        QRCode.toCanvas(
            canvas,
            getTableLink(payload),
            function (error) {
                if (error) console.error(error)
                console.log('success!')
            }
        )
    }, [payload])
    return <canvas className={styles} ref={canvasRef} />
}