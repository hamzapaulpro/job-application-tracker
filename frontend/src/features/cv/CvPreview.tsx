import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString()

type CvPreviewProps = {
    url: string
}

export default function CvPreview({ url }: CvPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(0)
    const [numPages, setNumPages] = useState(0)

    useEffect(() => {
        const container = containerRef.current

        if (!container) return

        const observer = new ResizeObserver(([entry]) => {
            setWidth(Math.floor(entry.contentRect.width))
        })

        observer.observe(container)

        return () => observer.disconnect()

    }, [])

    return (
        <div ref={containerRef} style={{ width: '100%', minWidth: 0 }}>
            {width > 0 && (
                <Document
                    file={url}
                    loading={<p>Loading preview…</p>}
                    error={<p>The PDF preview could not be loaded.</p>}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                >
                    {Array.from({ length: numPages }, (_, index) => (
                        <div key={index + 1} style={{ marginBottom: 16 }}>
                            <Page
                                pageNumber={index + 1}
                                width={width}
                            />
                        </div>
                    ))}
                </Document>
            )}
        </div>
    )
}