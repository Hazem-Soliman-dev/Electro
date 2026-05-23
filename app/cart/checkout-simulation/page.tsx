"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CreditCard, Shield, ChevronRight, Lock, ArrowLeft, Loader2, Sparkles } from "lucide-react";

function CheckoutSimulationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Card form dummy state
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12 / 29");
  const [cardCvv, setCardCvv] = useState("•••");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided.");
      setLoading(false);
      return;
    }

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to load order");
        }
        setOrder(data.order);
        setCardName(data.order.userName || "");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Could not fetch order information.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setProcessing(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Call PUT endpoint to update payment status to paid
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentStatus: "paid",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to process payment");
      }

      // Redirect back to order status page
      router.push(`/orders/${orderId}?payment=success`);
    } catch (err: any) {
      console.error(err);
      setError("Payment processing failed. Try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={36} />
        <p className="font-semibold text-sm">Initializing Polar Sandbox Checkout...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 p-4 text-center">
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl max-w-md">
          <h2 className="font-black text-lg mb-2">Checkout Error</h2>
          <p className="text-sm font-medium mb-4">{error || "Order details could not be parsed."}</p>
          <button
            onClick={() => router.push("/cart")}
            className="px-6 py-2 bg-zinc-800 text-white rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Top Banner indicating Simulation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-zinc-950 text-center py-2 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md">
        <Sparkles size={14} className="animate-bounce" />
        <span>POLAR PAYMENT SIMULATION MODE — PROTOTYPE ONLY</span>
      </div>

      <div className="w-full max-w-4xl bg-zinc-900 rounded-3xl border border-zinc-800/80 shadow-2xl overflow-hidden mt-8">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Form Left Side (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 border-b md:border-b-0 md:border-r border-zinc-800/60">
            <button
              onClick={() => router.push("/cart")}
              className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider mb-8"
            >
              <ArrowLeft size={14} />
              Back to cart
            </button>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                polar
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-sm bg-zinc-800 text-zinc-400 border border-zinc-700">
                sandbox
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black mb-6">Pay with Card</h2>

            <form onSubmit={handlePayment} className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all text-white font-mono"
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
                    <CreditCard size={18} />
                  </span>
                </div>
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM / YY"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all text-white text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    CVV
                  </label>
                  <input
                    type="text"
                    required
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all text-white text-center font-mono"
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all text-white"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={processing}
                className="w-full mt-6 py-3.5 px-4 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-200 active:scale-98 text-sm flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Processing Secure Payment...
                  </>
                ) : (
                  `Pay ${parseFloat(order.totalPrice).toFixed(2)} EGP`
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider pt-4">
                <Lock size={12} className="text-zinc-600" />
                <span>Secure SSL Checkout via Polar</span>
              </div>
            </form>
          </div>

          {/* Details Right Side (5 cols) */}
          <div className="md:col-span-5 p-6 sm:p-8 lg:p-10 bg-zinc-950 flex flex-col justify-between">
            <div>
              {/* Merchant Details */}
              <div className="flex items-center gap-3 mb-6 border-b border-zinc-800/80 pb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-black text-lg text-white">
                  E
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-none">Electro Pi</h3>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    electro.pi.merchant
                  </span>
                </div>
              </div>

              {/* Order Items list */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                  Order Items
                </span>
                <div className="max-h-48 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start gap-4 text-xs">
                      <div className="min-w-0">
                        <p className="font-bold text-zinc-300 truncate">
                          {item.nameEn}
                        </p>
                        <span className="text-zinc-500 font-semibold">
                          Qty {item.quantity} × {parseFloat(item.price).toFixed(2)} EGP
                        </span>
                      </div>
                      <span className="font-black text-zinc-200">
                        {(item.quantity * parseFloat(item.price)).toFixed(2)} EGP
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Block */}
            <div className="mt-8 border-t border-zinc-800/80 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-zinc-500 font-semibold">
                <span>Shipping</span>
                <span>3.00 EGP</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold border-t border-zinc-800/20 pt-2 text-zinc-200">
                <span>Amount Due</span>
                <span className="text-lg font-black text-white">
                  {parseFloat(order.totalPrice).toFixed(2)} EGP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSimulationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
          <Loader2 className="animate-spin text-orange-500 mb-4" size={36} />
          <p className="font-semibold text-sm">Loading simulation...</p>
        </div>
      }
    >
      <CheckoutSimulationContent />
    </Suspense>
  );
}
