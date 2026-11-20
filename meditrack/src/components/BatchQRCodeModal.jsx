import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, ExternalLink, ShieldCheck } from 'lucide-react';

export default function BatchQRCodeModal({ batch, isOpen, onClose }) {
  if (!isOpen || !batch) return null;

  // The tracking URL encoded in the QR code
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const trackingUrl = `${currentUrl}/?batchId=${encodeURIComponent(batch.batchId)}`;

  const downloadQRCode = () => {
    const svg = document.getElementById(`batch-qr-${batch.batchId}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QRCode-${batch.batchId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Batch Authenticity QR Code</h3>
          <p className="text-xs text-slate-400 mt-1">
            Scan with any smartphone camera to open the live supply-chain tracking page.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="mt-5 flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-inner border-4 border-slate-200">
          <QRCodeSVG
            id={`batch-qr-${batch.batchId}`}
            value={trackingUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
          <div className="mt-2 text-center text-slate-900 font-mono text-xs font-semibold">
            {batch.batchId}
          </div>
        </div>

        {/* Metadata info */}
        <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Medicine:</span>
            <span className="font-semibold text-slate-200">{batch.medicineName} {batch.strength}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Expiry Date:</span>
            <span className="font-semibold text-emerald-400">{batch.expDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <span className="font-medium text-amber-400">
              {batch.source === 'BLOCKCHAIN' ? 'On-Chain Verified' : 'Demo Record (Local)'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={downloadQRCode}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold text-sm transition shadow-lg shadow-teal-900/30"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </button>
          <a
            href={trackingUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-semibold text-sm transition"
          >
            <ExternalLink className="w-4 h-4" />
            Open Link
          </a>
        </div>
      </div>
    </div>
  );
}
