import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';

interface BarcodeScannerProps {
    onScan: (studentNumber: string) => void;
    onCameraStatusChange: (isActive: boolean) => void;
}

export function BarcodeScanner({ onScan, onCameraStatusChange }: BarcodeScannerProps) {
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const readerRef = useRef<BrowserMultiFormatReader | null>(null);

    useEffect(() => {
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.PDF_417]); // Specifically look for PDF417 barcodes
        
        const reader = new BrowserMultiFormatReader(hints);
        readerRef.current = reader;

        const startScanning = async () => {
            try {
                const videoElement = videoRef.current;
                if (!videoElement) return;

                const devices = await reader.listVideoInputDevices();
                if (devices.length === 0) {
                    throw new Error('No camera found');
                }

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                });
                
                videoElement.srcObject = stream;
                onCameraStatusChange(true);

                await reader.decodeFromConstraints(
                    {
                        video: {
                            facingMode: 'environment',
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        }
                    },
                    videoElement,
                    (result, error) => {
                        if (result) {
                            const text = result.getText();
                            if (text.match(/^2025-\d{4}$/)) {
                                onScan(text);
                            }
                        }
                        if (error) {
                            // Don't set errors for normal scanning attempts
                            if (error.name !== 'NotFoundException') {
                                setError(error.message || 'Scanning error');
                            }
                        }
                    }
                );
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to start scanner');
            }
        };

        startScanning();

        return () => {
            if (readerRef.current) {
                readerRef.current.reset();
                onCameraStatusChange(false);
            }
            const videoElement = videoRef.current;
            if (videoElement && videoElement.srcObject) {
                const stream = videoElement.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onScan, onCameraStatusChange]);

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                    ref={videoRef}
                    className="w-full h-[300px] object-cover"
                />
                {error && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-2 text-sm text-center">
                        {error}
                    </div>
                )}
            </div>
            <p className="mt-2 text-center text-gray-600 text-sm">
                Position the PDF417 barcode within the camera view to scan
            </p>
        </div>
    );
}