
import React, { useState } from 'react';
import '../css/Subscription.css';

const Subscription = () => {
    const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' or 'yearly'

    const plans = [
        {
            id: 'basic',
            name: 'Basic',
            icon: '💎', // Diamond
            price: { monthly: 0, yearly: 0 },
            isFree: true,
            desc: "Perfect for anyone curious to try Artify. Explore the core features at no cost and get a feel for what AI-powered creativity can do.",
            btnText: 'Active',
            btnClass: 'active',
            features: [
                "10 Credits reset daily",
                "Limited Image generation in Relax Mode (Artify models)",
                "Generate up to 2 images per request (excluding third-party models)",
                "Save up to 500 images in your collection",
                "Access to creation history for 30 days",
                "Editing tools included"
            ]
        },
        {
            id: 'mini',
            name: 'Mini',
            icon: '🔹', // Blue Diamond placeholder
            price: { monthly: 3.00, yearly: 2.40 },
            originalMonthly: 3.00,
            discountText: '20% off billed annually',
            desc: "Designed for light users who only need occasional access. A budget-friendly way to generate images without committing to a full plan.",
            btnText: 'Subscribe',
            btnClass: 'primary',
            features: [
                "10 Credits reset daily",
                "600 Credits per month",
                "Unlimited Image generation in Relax Mode (Artify models)",
                "Generate up to 4 images per request",
                "Queue up to 3 generations",
                "Save up to 500 images in your collection",
                "Access to full creation history during subscription",
                "Editing tools included"
            ]
        },
        {
            id: 'standard',
            name: 'Standard',
            icon: '🛡️', // Shield placeholder
            price: { monthly: 11.99, yearly: 6.30 },
            originalMonthly: 11.99,
            discountText: '47% off billed annually',
            desc: "Best for regular creators who want reliable access to more powerful features. Balanced in both price and capability, ideal for everyday use.",
            btnText: 'Subscribe',
            btnClass: 'primary',
            features: [
                "10 Credits reset daily",
                "5,000 Credits per month",
                "Unlimited Image generation in Relax Mode (Artify models)",
                "10% off Credit purchases",
                "Queue up to 5 generations",
                "Generate 2 tasks at once",
                "Access to full creation history during subscription",
                "Save up to 5,000 images in your collection",
                "Generate up to 4 images per request",
                "Editing tools included",
                "Batch downloads"
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            icon: '👑', // Crown
            price: { monthly: 28.99, yearly: 11.00 },
            originalMonthly: 28.99,
            discountText: '62% off billed annually',
            desc: "Tailored for power users and professionals. Unlock maximum performance, faster generation, and the most advanced features for serious creative work.",
            btnText: 'Subscribe',
            btnClass: 'primary',
            features: [
                "10 Credits reset daily",
                "5,000 Credits per month",
                "Unlimited Image generation in Relax Mode (Artify models)",
                "Unlimited video generation in Relax Mode (Artify models)",
                "20% off Credit purchases",
                "Queue up to 10 generations",
                "Generate 5 tasks at once",
                "Access to full creation history during subscription",
                "Save up to 50,000 images in your collection",
                "Generate up to 4 images per request",
                "Editing tools included",
                "Batch downloads"
            ]
        }
    ];

    const CheckIcon = () => (
        <div className="feature-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
    );

    return (
        <div className="subscription-container">
            <div className="sub-header">
                <div className="title-group">
                    <h1>Subscribe</h1>
                    <p>Plans designed to fit every creator.</p>
                </div>

                <div className="sub-controls">
                    <div className="billing-toggle">
                        <div
                            className={`toggle-option ${billingCycle === 'yearly' ? 'active' : ''}`}
                            onClick={() => setBillingCycle('yearly')}
                        >
                            Yearly
                        </div>
                        <div
                            className={`toggle-option ${billingCycle === 'monthly' ? 'active' : ''}`}
                            onClick={() => setBillingCycle('monthly')}
                        >
                            Monthly
                        </div>
                    </div>
                </div>


            </div>

            <div className="plans-grid">
                {plans.map((plan) => {
                    const price = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly;
                    const showDiscount = billingCycle === 'yearly' && !plan.isFree;

                    return (
                        <div key={plan.id} className="plan-card">
                            <div className="plan-header">
                                <span className="plan-icon">{plan.icon}</span>
                                <span className="plan-name">{plan.name}</span>
                            </div>

                            <div className="plan-pricing">
                                {plan.isFree ? (
                                    <div className="price-main">Free</div>
                                ) : (
                                    <>
                                        {showDiscount && (
                                            <span className="price-strike">${plan.originalMonthly.toFixed(2)} /Month</span>
                                        )}
                                        <div className="price-main">
                                            ${price.toFixed(2)}<span className="price-unit"> /Month</span>
                                        </div>
                                        {showDiscount && (
                                            <span className="discount-badge">{plan.discountText}</span>
                                        )}
                                    </>
                                )}
                            </div>

                            <p className="plan-desc">{plan.desc}</p>

                            <button className={`plan-btn ${plan.btnClass}`}>
                                {plan.btnText}
                            </button>

                            <div className="plan-features">
                                <div className="features-title">Features:</div>
                                <ul className="features-list">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="feature-item">
                                            <CheckIcon />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Subscription;
