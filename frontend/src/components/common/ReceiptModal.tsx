import React, { useEffect } from 'react';
import { Sale } from '../../types';
import { formatCurrency, formatDate, formatTime, getPaymentLabel } from '../../utils/formatters';
import { X, Printer } from 'lucide-react';
import zibanoLogo from '../../assets/logo/Z LOGO.png';
import './ReceiptModal.css';

interface ReceiptModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export default function ReceiptModal({ sale, onClose }: ReceiptModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!sale) return null;

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.print();
  };

  return (
    <div className="receipt-overlay" onClick={onClose}>
      <div className="receipt-modal-wrapper" onClick={(e) => e.stopPropagation()}>
        {/* Floating Close Button */}
        <button
          type="button"
          className="receipt-close-btn"
          onClick={onClose}
          aria-label="Close receipt"
          title="Close (Esc)"
        >
          <X size={18} />
        </button>

        {/* Printer Dispenser Slot */}
        <div className="receipt-slot-bezel">
          <div className="receipt-slot-inner">
            <div className="receipt-slot-hole" />
          </div>
        </div>

        {/* Realistic Thermal Receipt Slip */}
        <div className="receipt-paper" id="printable-receipt">
          {/* Top Brand Header */}
          <div className="receipt-brand-header">
            <div className="receipt-brand-logo-wrap">
              <img src={zibanoLogo} alt="Zibano Coffee" className="receipt-brand-logo" />
            </div>
            <h2 className="receipt-brand-title">Zibano Coffee</h2>
            <h3 className="receipt-brand-amharic">ዝባኖ ቡና</h3>
            <p className="receipt-brand-address">Bole Bulbula Condominum · Addis Ababa, Ethiopia</p>
            <p className="receipt-brand-tel">Tel: +251 943 33 33 72</p>
          </div>

          <div className="receipt-divider-double-dashed">
            <div className="receipt-dash-line" />
            <div className="receipt-dash-line" />
          </div>

          {/* RECEIPT title */}
          <div className="receipt-type-title">
            <span>RECEIPT</span>
          </div>

          <div className="receipt-divider-double-dashed">
            <div className="receipt-dash-line" />
            <div className="receipt-dash-line" />
          </div>

          {/* Order Details */}
          <div className="receipt-meta-grid">
            <div className="receipt-meta-row">
              <span className="receipt-meta-label">ORDER #</span>
              <span className="receipt-meta-val receipt-bold">{sale.orderNumber}</span>
            </div>
            <div className="receipt-meta-row">
              <span className="receipt-meta-label">DATE &amp; TIME</span>
              <span className="receipt-meta-val">{formatDate(sale.createdAt)} · {formatTime(sale.createdAt)}</span>
            </div>
            <div className="receipt-meta-row">
              <span className="receipt-meta-label">WAITER</span>
              <span className="receipt-meta-val">{sale.waiterName}</span>
            </div>            
          </div>

          <div className="receipt-divider-dashed" />

          {/* Items List */}
          <div className="receipt-items-list">
            {sale.items.map((item, idx) => (
              <div key={idx} className="receipt-item-row">
                <div className="receipt-item-left">
                  <span className="receipt-item-qty">{item.quantity}x</span>
                  <span className="receipt-item-name">{item.productName}</span>
                </div>
                <span className="receipt-item-subtotal">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="receipt-divider-dashed" />

          {/* Total Amount */}
          <div className="receipt-total-row">
            <span className="receipt-total-label">TOTAL AMOUNT</span>
            <span className="receipt-total-val">{formatCurrency(sale.total)}</span>
          </div>

          <div className="receipt-divider-dashed" />

          {/* Payment Details */}
          <div className="receipt-payment-section">
            <div className="receipt-meta-row">
              <span className="receipt-meta-label">PAYMENT:</span>
              <span className="receipt-meta-val receipt-bold">{getPaymentLabel(sale.paymentMethod).toUpperCase()}</span>
            </div>
            
            {sale.status === 'voided' && (
              <div className="receipt-voided-stamp">
                *** VOIDED SALE ***
              </div>
            )}
          </div>

          <div className="receipt-divider-dashed" />

          {/* Thank You Footer */}
          <div className="receipt-footer">
            <p className="receipt-thank-you">THANK YOU · እናመሰግናለን</p>
            <p className="receipt-sub-msg">PLEASE VISIT US AGAIN</p>

            {/* Realistic Barcode */}
            <div className="receipt-barcode-container">
              <svg className="receipt-barcode-svg" viewBox="0 0 200 42" preserveAspectRatio="none">
                <g fill="#1F2937">
                  <rect x="0" y="0" width="3" height="40" />
                  <rect x="5" y="0" width="1" height="40" />
                  <rect x="8" y="0" width="4" height="40" />
                  <rect x="15" y="0" width="2" height="40" />
                  <rect x="19" y="0" width="3" height="40" />
                  <rect x="25" y="0" width="1" height="40" />
                  <rect x="28" y="0" width="5" height="40" />
                  <rect x="36" y="0" width="2" height="40" />
                  <rect x="40" y="0" width="4" height="40" />
                  <rect x="46" y="0" width="1" height="40" />
                  <rect x="50" y="0" width="3" height="40" />
                  <rect x="56" y="0" width="2" height="40" />
                  <rect x="60" y="0" width="5" height="40" />
                  <rect x="68" y="0" width="1" height="40" />
                  <rect x="72" y="0" width="4" height="40" />
                  <rect x="78" y="0" width="2" height="40" />
                  <rect x="82" y="0" width="3" height="40" />
                  <rect x="88" y="0" width="1" height="40" />
                  <rect x="92" y="0" width="4" height="40" />
                  <rect x="98" y="0" width="3" height="40" />
                  <rect x="103" y="0" width="1" height="40" />
                  <rect x="107" y="0" width="5" height="40" />
                  <rect x="114" y="0" width="2" height="40" />
                  <rect x="118" y="0" width="3" height="40" />
                  <rect x="124" y="0" width="1" height="40" />
                  <rect x="128" y="0" width="4" height="40" />
                  <rect x="135" y="0" width="2" height="40" />
                  <rect x="140" y="0" width="3" height="40" />
                  <rect x="145" y="0" width="1" height="40" />
                  <rect x="148" y="0" width="5" height="40" />
                  <rect x="156" y="0" width="2" height="40" />
                  <rect x="160" y="0" width="4" height="40" />
                  <rect x="166" y="0" width="1" height="40" />
                  <rect x="170" y="0" width="3" height="40" />
                  <rect x="176" y="0" width="2" height="40" />
                  <rect x="180" y="0" width="4" height="40" />
                  <rect x="186" y="0" width="2" height="40" />
                  <rect x="190" y="0" width="3" height="40" />
                  <rect x="196" y="0" width="4" height="40" />
                </g>
              </svg>
              <span className="receipt-barcode-text">{sale.id.replace('s', '2026')}-{sale.orderNumber.replace('#', '')}</span>
            </div>
          </div>

          {/* Realistic Zigzag Perforated Scallop Bottom Edge */}
          <div className="receipt-scallop-bottom" />
        </div>

        {/* Action Button: Print */}
        <div className="receipt-actions">
          <button type="button" className="receipt-action-btn" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
