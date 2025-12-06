import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CenteredContainer from "./CenteredContainer";
import {
  CheckCircle,
  XCircle,
  ArrowUp,
  Shield,
  Zap,
  Users,
  Cloud,
  CreditCard,
  BadgeCheck,
} from "lucide-react";

export default function Upgrade() {
  const { currentUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "/month",
      description: "For personal use",
      features: [
        { text: "15 GB storage", included: true },
        { text: "Basic file sharing", included: true },
        { text: "Mobile app access", included: true },
        { text: "Standard support", included: true },
        { text: "100 MB file size limit", included: true },
        { text: "Advanced analytics", included: false },
        { text: "Priority support", included: false },
        { text: "Team collaboration", included: false },
      ],
      buttonText: "Current Plan",
      disabled: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$9.99",
      period: "/month",
      description: "For professionals",
      popular: true,
      features: [
        { text: "100 GB storage", included: true },
        { text: "Advanced file sharing", included: true },
        { text: "Mobile app access", included: true },
        { text: "Priority support", included: true },
        { text: "2 GB file size limit", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Custom branding", included: false },
        { text: "Team collaboration", included: false },
      ],
      buttonText: "Upgrade to Pro",
      disabled: false,
    },
    {
      id: "team",
      name: "Team",
      price: "$24.99",
      period: "/month",
      description: "For teams & businesses",
      features: [
        { text: "1 TB storage", included: true },
        { text: "Advanced file sharing", included: true },
        { text: "Mobile app access", included: true },
        { text: "24/7 priority support", included: true },
        { text: "5 GB file size limit", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Custom branding", included: true },
        { text: "Team collaboration", included: true },
      ],
      buttonText: "Upgrade to Team",
      disabled: false,
    },
  ];

  const handleUpgrade = () => {
    // In a real app, this would integrate with a payment processor
    alert(`Upgrading to ${selectedPlan.toUpperCase()} plan...`);
    // Redirect to payment page or show payment modal
  };

  return (
    <CenteredContainer title="Upgrade Your Plan" subtitle="Choose the perfect plan for your needs">
      <div className="space-y-8">
        {/* User Info */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Current Plan: <span className="text-primary-600">Free</span>
              </h3>
              <p className="text-gray-600 mt-1">
                {currentUser?.email || "User"} • 2.5 GB of 15 GB used
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                to="/"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border-2 p-6 transition-all duration-200 ${
                selectedPlan === plan.id
                  ? "border-primary-500 bg-primary-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-primary-300"
              } ${plan.popular ? "ring-2 ring-primary-300" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    {feature.included ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300 mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (!plan.disabled) {
                    setSelectedPlan(plan.id);
                    handleUpgrade();
                  }
                }}
                disabled={plan.disabled}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  plan.disabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : selectedPlan === plan.id
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            All Premium Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900">Fast Uploads</h4>
              <p className="text-sm text-gray-600 mt-1">
                Lightning-fast file uploads and downloads
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900">Enhanced Security</h4>
              <p className="text-sm text-gray-600 mt-1">
                Military-grade encryption for all your files
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900">Team Collaboration</h4>
              <p className="text-sm text-gray-600 mt-1">
                Share and collaborate with your team seamlessly
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                <Cloud className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-medium text-gray-900">More Storage</h4>
              <p className="text-sm text-gray-600 mt-1">
                Get up to 1TB of secure cloud storage
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Secure Payment
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Credit/Debit Card</h4>
                  <p className="text-sm text-gray-600">Pay with Visa, MasterCard, or American Express</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  VISA
                </span>
                <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-800 rounded">
                  MASTERCARD
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zm5 17a1 1 0 100-2 1 1 0 000 2z"/>
                </svg>
                <div>
                  <h4 className="font-medium text-gray-900">PayPal</h4>
                  <p className="text-sm text-gray-600">Pay securely with your PayPal account</p>
                </div>
              </div>
              <BadgeCheck className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Can I cancel anytime?</h4>
              <p className="text-gray-600 text-sm mt-1">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Is there a free trial?</h4>
              <p className="text-gray-600 text-sm mt-1">
                All paid plans come with a 14-day free trial. No credit card required to start the trial.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">What happens to my files if I downgrade?</h4>
              <p className="text-gray-600 text-sm mt-1">
                Your files remain safe. You'll need to free up space to fit within your new storage limit before downgrading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CenteredContainer>
  );
}