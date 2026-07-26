import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';

interface BarcodeScannerProps {
    onScan: (studentNumber: string) => void;
    onCameraStatusChange: (isActive: boolean) => void;
}

type ScannerErrorKind = 'unsupported' | 'permission-denied' | 'no-camera' | 'other';

interface ScannerError {
    kind: ScannerErrorKind;
    message: string;
}

const isCameraSupported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

export function BarcodeScanner({ onScan, onCameraStatusChange }: BarcodeScannerProps) {
    const [error, setError] = useState<ScannerError | null>(null);
    const [retryKey, setRetryKey] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const readerRef = useRef<BrowserMultiFormatReader | null>(null);

    const handleRetry = useCallback(() => {
        setError(null);
        setRetryKey((key) => key + 1);
    }, []);

    useEffect(() => {
        if (!isCameraSupported) return;

        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.PDF_417]); // Specifically look for PDF417 barcodes

        const reader = new BrowserMultiFormatReader(hints);
        readerRef.current = reader;
        const videoElement = videoRef.current;

        const startScanning = async () => {
            try {
                if (!videoElement) return;

                const devices = await reader.listVideoInputDevices();
                if (devices.length === 0) {
                    setError({
                        kind: 'no-camera',
                        message: "No camera was found on this device. Connect a camera and try again.",
                    });
                    return;
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
                            // Student number format: <4-digit cohort year>-<4-digit student number>,
                            // e.g. "2025-0001" or "2026-0042". Update this pattern if the
                            // numbering scheme ever changes (e.g. to a different digit count).
                            if (text.match(/^\d{4}-\d{4}$/)) {
                                onScan(text);
                            }
                        }
                        if (error) {
                            // Don't set errors for normal scanning attempts
                            if (error.name !== 'NotFoundException') {
                                setError({ kind: 'other', message: error.message || 'Scanning error' });
                            }
                        }
                    }
                );
            } catch (err) {
                if (err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
                    setError({
                        kind: 'permission-denied',
                        message: "Camera access was denied. Allow camera access for this site in your browser settings, then try again.",
                    });
                } else if (err instanceof DOMException && err.name === 'NotFoundError') {
                    setError({
                        kind: 'no-camera',
                        message: "No camera was found on this device. Connect a camera and try again.",
                    });
                } else {
                    setError({
                        kind: 'other',
                        message: err instanceof Error ? err.message : 'Failed to start scanner',
                    });
                }
            }
        };

        startScanning();

        return () => {
            if (readerRef.current) {
                readerRef.current.reset();
                onCameraStatusChange(false);
            }
            if (videoElement && videoElement.srcObject) {
                const stream = videoElement.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onScan, onCameraStatusChange, retryKey]);

    const displayError: ScannerError | null = !isCameraSupported
        ? {
              kind: 'unsupported',
              message: "Your browser doesn't support camera scanning. Please use a recent version of Chrome, Safari, or Edge.",
          }
        : error;

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                    ref={videoRef}
                    className="w-full h-[300px] object-cover"
                />
                {displayError && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-2 text-sm text-center flex flex-col gap-2 items-center">
                        <span>{displayError.message}</span>
                        {displayError.kind !== 'unsupported' && (
                            <button
                                onClick={handleRetry}
                                className="bg-white text-red-600 font-semibold text-xs px-3 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                                Try again
                            </button>
                        )}
                    </div>
                )}
            </div>
            <p className="mt-2 text-center text-gray-600 text-sm">
                Position the PDF417 barcode within the camera view to scan
            </p>
        </div>
    );
}
